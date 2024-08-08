<?php

use App\Models\Status;
use App\Models\User;
use App\Models\Workspace;

it('should not create a status on invalid data', function() {
    $workspace = Workspace::factory()->create();
    $user = User::factory()->hasAttached($workspace)->create();

    $params = ['name' => ''];
    $response = $this->actingAs($user)->postJson("/api/workspaces/$workspace->id/statuses", $params);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['name']);
});

it('should create a status on valid data', function() {
    $workspace = Workspace::factory()->create();
    $user = User::factory()->hasAttached($workspace)->create();

    $params = ['name' => fake()->word()];
    $response = $this->actingAs($user)->postJson("/api/workspaces/$workspace->id/statuses", $params);

    $response->assertStatus(201);
    $response->assertJsonFragment($params);

    $workspace = Workspace::with('statuses')->find($workspace->id);
    expect(count($workspace->statuses->all()))->toBe(1);
});

it('should not update a status on invalid data', function() {
    $workspace = Workspace::factory()->create();
    $user = User::factory()->hasAttached($workspace)->create();
    $status = Status::factory()->create([
        'workspace_id' => $workspace->id
    ]);

    $params = ['name' => ''];
    $response = $this->actingAs($user)->patchJson("/api/workspaces/$workspace->id/statuses/$status->id", $params);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['name']);

    $latestStatus = Status::find($status->id);

    expect($latestStatus->name)->not->toBe($params["name"]);
});

it('should update a status on valid data', function() {
    $workspace = Workspace::factory()->create();
    $user = User::factory()->hasAttached($workspace)->create();
    $status = Status::factory()->create([
        'workspace_id' => $workspace->id
    ]);

    $params = ['name' => fake()->word()];
    $response = $this->actingAs($user)->patchJson("/api/workspaces/$workspace->id/statuses/$status->id", $params);

    $response->assertStatus(200);
    $response->assertJsonFragment($params);

    $latestStatus = Status::find($status->id);

    expect($latestStatus->name)->toBe($params["name"]);
});

it('should not delete a non existing status', function() {
    $workspace = Workspace::factory()->create();
    $user = User::factory()->hasAttached($workspace)->create();

    $response = $this->actingAs($user)->deleteJson("/api/workspaces/$workspace->id/statuses/0000111");

    $response->assertStatus(404);
    $response->assertJson(["message" => "Record not found."]);
});

it('should delete a valid status', function() {
    $workspace = Workspace::factory()->create();
    $user = User::factory()->hasAttached($workspace)->create();
    $status = Status::factory()->create([
        'workspace_id' => $workspace->id
    ]);

    $response = $this->actingAs($user)->deleteJson("/api/workspaces/$workspace->id/statuses/$status->id");

    $response->assertStatus(200);
    $response->assertJson(["data" => ["message" => $status->name . " has been deleted successfully."]]);

    $status = Status::find($status->id);

    expect($status)->toBeNull();
});

it('should return the same number of all statuses created in a workspace.', function() {
    $workspace = Workspace::factory()->has(Status::factory(10))->create();
    $user = User::factory()->hasAttached($workspace)->create();

    $response = $this->actingAs($user)->getJson("/api/workspaces/$workspace->id/statuses");
    $data = $response->decodeResponseJson()['data'];

    $response->assertStatus(200);
    expect(count($data))->toBe(10);
});

it('should return a single status in a workspace.', function() {
    $workspace = Workspace::factory()->create();
    $status = Status::factory()->create(['workspace_id' => $workspace->id]);
    $user = User::factory()->hasAttached($workspace)->create();

    $response = $this->actingAs($user)->getJson("/api/workspaces/$workspace->id/statuses/$status->id");
    $data = $response->decodeResponseJson()['data'];

    $response->assertStatus(200);
    expect($data)->not()->toBeNull();
    expect($data["name"])->toBe($status->name);
});