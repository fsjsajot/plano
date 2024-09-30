<?php

use App\Models\Board;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Str;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->user2 = User::factory()->create(['user_role_id' => 1]); // admin account
    $this->workspace = Workspace::factory()->hasAttached($this->user, [], 'members')->create(['user_id' => $this->user->id]);
    Sanctum::actingAs($this->user);
});

it('should list all boards in a workspace.', function () {
    Board::factory(10)->for($this->workspace)->create();

    $this->getJson("/api/workspaces/{$this->workspace->id}/boards")
        ->assertOk()
        ->assertJson(function (AssertableJson $json) {
            $json->has('data', 10);
        });
});

it('should return a single board in a workspace', function () {
    $board = Board::factory()->for($this->workspace)->create();

    $this->getJson("/api/workspaces/{$this->workspace->id}/boards/{$board->id}")
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($board) {
            $json->has('data')
                ->where('data.name', $board->name)
                ->where('data.description', $board->description);
        });
});

it('should not create a board when request is invalid.', function () {
    $params = ['name' => ''];
    $this->postJson("/api/workspaces/{$this->workspace->id}/boards", $params)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name'])
        ->assertJson(['message' => 'The name field is required.']);

    $params = ['name' => Str::repeat("test", 200)];
    $this->postJson("/api/workspaces/{$this->workspace->id}/boards", $params)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name'])
        ->assertJson(['message' => 'The name field must not be greater than 256 characters.']);
});

it('should create a board when request is valid.', function () {
    $params = ['name' => fake()->word(), 'description' => fake()->sentence()];

    $this->postJson("/api/workspaces/{$this->workspace->id}/boards", $params)
        ->assertCreated()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.name', $params['name'])
                ->where('data.description', $params['description']);
        });
});

it('should fail when updating a resource if user is not a workspace owner.', function () {
    // logged in with a different user account 
    $user3 = User::factory()->create();
    Sanctum::actingAs($user3);

    $board = Board::factory()->for($this->workspace)->create();
    $params = [
        "name" => "test"
    ];

    $this->patchJson("/api/workspaces/{$this->workspace->id}/boards/{$board->id}", $params)
        ->assertForbidden();
});

it('should update if the resource is created by the workspace owner.', function () {
    $board = Board::factory()->for($this->workspace)->create();
    $params = [
        "name" => "test"
    ];

    $this->patchJson("/api/workspaces/{$this->workspace->id}/boards/{$board->id}", $params)
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.name', $params['name']);
        });
});

it('should update if the current user is an admin.', function () {
    // logged in as an admin
    Sanctum::actingAs($this->user2);

    $board = Board::factory()->for($this->workspace)->create();
    $params = [
        "name" => "test"
    ];

    $this->patchJson("/api/workspaces/{$this->workspace->id}/boards/{$board->id}", $params)
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.name', $params['name']);
        });
});

it('should not update a board when request is invalid.', function () {
    $board = Board::factory()->for($this->workspace)->create();
    $params = ['name' => ''];
    $this->patchJson("/api/workspaces/{$this->workspace->id}/boards/{$board->id}", $params)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name'])
        ->assertJson(['message' => 'The name field is required.']);

    $params = ['name' => Str::repeat("test", 200)];
    $this->patchJson("/api/workspaces/{$this->workspace->id}/boards/{$board->id}", $params)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name'])
        ->assertJson(['message' => 'The name field must not be greater than 256 characters.']);
});

it('should not update a non existing board.', function () {
    $params = ['name' => fake()->word()];

    $this->patchJson("/api/workspaces/{$this->workspace->id}/boards/10000", $params)
        ->assertNotFound()
        ->assertJson(['data' => ['message' => 'Resource not found.']]);
});

it('should update a board when request is valid.', function () {
    $params = ['name' => fake()->word(), 'description' => fake()->sentence()];
    $board = Board::factory()->for($this->workspace)->create();

    $this->patchJson("/api/workspaces/{$this->workspace->id}/boards/{$board->id}", $params)
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.name', $params['name'])
                ->where('data.description', $params['description']);
        });
});

it('should fail when deleting a resource if user is not a workspace owner.', function () {
    // logged in with a different user account 
    $user3 = User::factory()->create();
    Sanctum::actingAs($user3);

    $board = Board::factory()->for($this->workspace)->create();

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$board->id}")
        ->assertForbidden();
});

it('should delete if the resource is created by the workspace owner.', function () {
    $board = Board::factory()->for($this->workspace)->create();

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$board->id}")
        ->assertOk()
        ->assertJson(["data" => ["message" => "{$board->name} has been deleted successfully."]]);
});

it('should delete if the current user is an admin.', function () {
    // logged in as an admin
    Sanctum::actingAs($this->user2);

    $board = Board::factory()->for($this->workspace)->create();

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$board->id}")
        ->assertOk()
        ->assertJson(["data" => ["message" => "{$board->name} has been deleted successfully."]]);
});

it('should not delete a non existing board.', function () {
    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/10000")
        ->assertNotFound()
        ->assertJson(['data' => ['message' => 'Resource not found.']]);
});

it('should delete an existing board.', function () {
    $board = Board::factory()->for($this->workspace)->create();

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$board->id}")
        ->assertOk()
        ->assertJson(["data" => ["message" => "{$board->name} has been deleted successfully."]]);
});