<?php

use App\Models\Board;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Str;

it('should list all boards in a workspace.', function () {
    $workspace = Workspace::factory()->hasBoards(10)->create();
    $user = User::factory()->hasAttached($workspace)->create();


    $response = $this->actingAs($user)->getJson("/api/workspaces/$workspace->id/boards");
    $data = $response->json()['data'];


    $response->assertStatus(200);
    expect($data)->each->toMatchArray(['workspace_id' => $workspace->id]);
    expect($data)->toHaveCount(10);
});

it('should return a single board in a workspace', function () {
    $workspace = Workspace::factory()->create();
    $board = Board::factory()->for($workspace)->create();

    $user = User::factory()->hasAttached($workspace)->create();

    $response = $this->actingAs($user)->getJson("/api/workspaces/$workspace->id/boards/$board->id");
    $data = $response->json()['data'];

    $response->assertStatus(200);
    expect($data['name'])->toContain($board->name);


    $response = $this->actingAs($user)->getJson("/api/workspaces/$workspace->id/boards/10000");

    $response->assertStatus(404);
    $response->assertJson(['data' => ['message' => 'Resource not found.']]);
});

it('should not create a board when request is invalid.', function () {
    $params = ['name' => ''];
    $workspace = Workspace::factory()->create();
    $user = User::factory()->hasAttached($workspace)->create();

    $response = $this->actingAs($user)->postJson("/api/workspaces/$workspace->id/boards", $params);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['name']);
    expect($response['message'])->toBe('The name field is required.');


    $params = ['name' => Str::repeat('test', 100)];
    $response = $this->actingAs($user)->postJson("/api/workspaces/$workspace->id/boards", $params);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['name']);
    expect($response['message'])->toBe('The name field must not be greater than 256 characters.');
});

it('should create a board when request is valid.', function () {
    $params = ['name' => fake()->word()];
    $workspace = Workspace::factory()->create();
    $user = User::factory()->hasAttached($workspace)->create();

    $response = $this->actingAs($user)->postJson("/api/workspaces/$workspace->id/boards", $params);
    $data = $response->json()['data'];

    $response->assertStatus(201);
    expect($data['name'])->toBe($params['name']);

    $boardId = $data['id'];
    $response = $this->actingAs($user)->getJson("/api/workspaces/$workspace->id/boards/$boardId");
    $data = $response->json()['data'];

    $response->assertStatus(200);
    expect($data)->not->toBeNull();
});

it('should not update a board when request is invalid.', function () {
    $params = ['name' => ''];

    $workspace = Workspace::factory()->create();
    $board = Board::factory()->for($workspace)->create();
    $user = User::factory()->hasAttached($workspace)->create();

    $response = $this->actingAs($user)->patchJson("/api/workspaces/$workspace->id/boards/$board->id", $params);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['name']);
    expect($response['message'])->toBe('The name field is required.');


    $params = ['name' => Str::repeat('test', 100)];
    $response = $this->actingAs($user)->patchJson("/api/workspaces/$workspace->id/boards/$board->id", $params);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['name']);
    expect($response['message'])->toBe('The name field must not be greater than 256 characters.');
});

it('should not update a non existing board.', function () {
    $params = ['name' => fake()->word()];
    $workspace = Workspace::factory()->create();
    $user = User::factory()->hasAttached($workspace)->create();

    $response = $this->actingAs($user)->patchJson("/api/workspaces/$workspace->id/boards/10000", $params);
    $data = $response->json();

    $response->assertStatus(404);
    $response->assertJson(['data' => ['message' => 'Resource not found.']]);
});

it('should update a board when request is valid.', function () {
    $params = ['name' => fake()->word()];
    $workspace = Workspace::factory()->create();
    $board = Board::factory()->for($workspace)->create();
    $user = User::factory()->hasAttached($workspace)->create();

    $response = $this->actingAs($user)->patchJson("/api/workspaces/$workspace->id/boards/$board->id", $params);

    $response->assertStatus(200);
    $response->assertJsonFragment($params);


    $board = Board::find($board->id);
    expect($board->name)->toBe($params['name']);
});


it('should not delete a non existing board.', function () {
    $workspace = Workspace::factory()->create();
    $user = User::factory()->hasAttached($workspace)->create();

    $response = $this->actingAs($user)->getJson("/api/workspaces/$workspace->id/boards/10000");
    $response->assertStatus(404);
    $response->assertJson(['data' => ['message' => 'Resource not found.']]);
});

it('should delete an existing board.', function () {
    $workspace = Workspace::factory()->create();
    $board = Board::factory()->for($workspace)->create();
    $user = User::factory()->hasAttached($workspace)->create();


    $response = $this->actingAs($user)->deleteJson("/api/workspaces/$workspace->id/boards/$board->id");
    $response->assertStatus(200);
    $response->assertJson(["data" => ["message" => $board->name . " has been deleted successfully."]]);

    $response = $this->actingAs($user)->getJson("/api/workspaces/$workspace->id/boards/$board->id");
    $response->assertStatus(404);
    $response->assertJson(['data' => ['message' => 'Resource not found.']]);
});