<?php

use App\Models\Status;
use App\Models\User;
use App\Models\Workspace;
use Laravel\Sanctum\Sanctum;
use Illuminate\Support\Str;
use Illuminate\Testing\Fluent\AssertableJson;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->user2 = User::factory()->create(['user_role_id' => 1]); // admin account
    $this->workspace = Workspace::factory()->hasAttached($this->user, [], 'members')->create(['user_id' => $this->user->id]);
    Sanctum::actingAs($this->user);
});

it('should return the same number of all statuses created in a workspace.', function () {
    Status::factory(20)->for($this->workspace)->create();
    $this->getJson("/api/workspaces/{$this->workspace->id}/statuses")
        ->assertOk()
        ->assertJson(function (AssertableJson $json) {
            $json->has('data', 20);
        });
});

it('should return a single status in a workspace.', function () {
    $status = Status::factory()->create(['workspace_id' => $this->workspace->id]);

    $this->getJson("/api/workspaces/{$this->workspace->id}/statuses/{$status->id}")
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($status) {
            $json->has('data')
                ->where('data.name', $status->name);
        });
});


it('should fail when updating a resource if user is not a workspace owner.', function () {
    // logged in with a different user account 
    $user3 = User::factory()->create();
    Sanctum::actingAs($user3);

    $status = Status::factory()->for($this->workspace)->create();
    $params = [
        "name" => "test"
    ];

    $this->patchJson("/api/workspaces/{$this->workspace->id}/statuses/{$status->id}", $params)
        ->assertForbidden();
});

it('should update if the resource is created by the workspace owner.', function () {
    $status = Status::factory()->for($this->workspace)->create();
    $params = [
        "name" => "test"
    ];

    $this->patchJson("/api/workspaces/{$this->workspace->id}/statuses/{$status->id}", $params)
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.name', $params['name']);
        });
});

it('should update if the current user is an admin.', function () {
    // logged in as an admin
    Sanctum::actingAs($this->user2);

    $status = Status::factory()->for($this->workspace)->create();
    $params = [
        "name" => "test"
    ];

    $this->patchJson("/api/workspaces/{$this->workspace->id}/statuses/{$status->id}", $params)
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.name', $params['name']);
        });
});

it('should not create a status on invalid data', function () {
    $params = ['name' => ''];
    $this->postJson("/api/workspaces/{$this->workspace->id}/statuses", $params)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name'])
        ->assertJson(['message' => 'The name field is required.']);

    $params = ['name' => Str::repeat("test", 200)];
    $this->postJson("/api/workspaces/{$this->workspace->id}/statuses", $params)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name'])
        ->assertJson(['message' => 'The name field must not be greater than 256 characters.']);
});

it('should create a status on valid data', function () {
    $params = ['name' => fake()->word(), 'position' => 1];
    $this->postJson("/api/workspaces/{$this->workspace->id}/statuses", $params)
        ->assertCreated()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json
                ->has('data')
                ->where('data.name', $params['name'])
                ->where('data.position', $params['position']);
        });
});

it('should not update a status on invalid data', function () {
    $status = Status::factory()->create([
        'workspace_id' => $this->workspace->id
    ]);

    $params = ['name' => ''];
    $this->patchJson("/api/workspaces/{$this->workspace->id}/statuses/{$status->id}", $params)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name'])
        ->assertJson(['message' => 'The name field is required.']);

    $params = ['name' => Str::repeat("test", 200)];
    $this->patchJson("/api/workspaces/{$this->workspace->id}/statuses/{$status->id}", $params)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name'])
        ->assertJson(['message' => 'The name field must not be greater than 256 characters.']);
});

it('should update a status on valid data', function () {
    $status = Status::factory()->create([
        'workspace_id' => $this->workspace->id
    ]);

    $params = ['name' => fake()->word(), 'position' => 2, 'visibility' => true];
    $this->patchJson("/api/workspaces/{$this->workspace->id}/statuses/{$status->id}", $params)
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json
                ->has('data')
                ->where('data.name', $params['name'])
                ->where('data.position', $params['position'])
                ->where('data.visibility', $params['visibility']);
        });
});


it('should fail when deleting a resource if user is not a workspace owner.', function () {
    // logged in with a different user account 
    $user3 = User::factory()->create();
    Sanctum::actingAs($user3);

    $status = Status::factory()->for($this->workspace)->create();

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/statuses/{$status->id}")
        ->assertForbidden();
});

it('should delete if the resource is created by the workspace owner.', function () {
    $status = Status::factory()->for($this->workspace)->create();

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/statuses/{$status->id}")
        ->assertOk()
        ->assertJson(["data" => ["message" => "{$status->name} has been deleted successfully."]]);
});

it('should delete if the current user is an admin.', function () {
    // logged in as an admin
    Sanctum::actingAs($this->user2);

    $status = Status::factory()->for($this->workspace)->create();

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/statuses/{$status->id}")
        ->assertOk()
        ->assertJson(["data" => ["message" => "{$status->name} has been deleted successfully."]]);
});

it('should not delete a non existing status', function () {
    $this->deleteJson("/api/workspaces/{$this->workspace->id}/statuses/10000")
        ->assertNotFound()
        ->assertJson(['data' => ['message' => 'Resource not found.']]);
});

it('should delete a valid status', function () {
    $status = Status::factory()->create([
        'workspace_id' => $this->workspace->id
    ]);

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/statuses/{$status->id}")
        ->assertOk()
        ->assertJson(["data" => ["message" => "{$status->name} has been deleted successfully."]]);
});