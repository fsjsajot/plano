<?php

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

it('should not create a workspace when the required fields are missing.', function () {
    $this->postJson("/api/workspaces", [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'subdomain']);
});

it('should not create a workspace when subdomain is more than 255 characters', function () {
    $this->postJson("/api/workspaces", [
        "user_id" => $this->user->id,
        "name" => fake()->name(),
        "subdomain" => Str::repeat("test", 75)
    ])->assertStatus(422)
        ->assertJsonValidationErrors(['subdomain']);
});

it('should not update a workspace when the required fields are missing.', function () {
    $this->patchJson("/api/workspaces/{$this->workspace->id}", [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'subdomain']);
});

it('should not update a workspace when subdomain is more than 255 characters', function () {
    $params = [
        "user_id" => $this->user->id,
        "name" => fake()->name(),
        "subdomain" => Str::repeat("test", 75)
    ];

    $this->patchJson("/api/workspaces/{$this->workspace->id}", $params)
        ->assertStatus(422)
        ->assertJsonValidationErrors(['subdomain']);
});

it('should return the same number of workspaces created for the user.', function () {
    $user2 = User::factory()->create();
    Workspace::factory(10)->hasAttached($user2, [], 'members')->create([
        'user_id' => $user2->id
    ]);

    Sanctum::actingAs($user2);

    $this->getJson("/api/workspaces")
        ->assertOk()
        ->assertJson(function (AssertableJson $json) {
            $json->has('data', 10);
        });
});

it('should create a workspace when the request data is valid.', function () {
    $user2 = User::factory()->create();
    $params = Workspace::factory()->raw(['user_id' => $user2->id]);

    Sanctum::actingAs($user2);

    $this->postJson("/api/workspaces", $params)
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.name', $params['name'])
                ->where('data.subdomain', $params['subdomain']);
        });
});

it('should fail when updating a resource if user does not created it.', function () {
    // logged in with a different user account 
    $user3 = User::factory()->create();
    $workspace = Workspace::factory()->hasAttached($user3, [], 'members')->create(['user_id' => $user3->id]);

    $params = [
        "name" => fake()->name(),
        "subdomain" => "mytest"
    ];

    $this->patchJson("/api/workspaces/{$workspace->id}", $params)
        ->assertForbidden();
});

it('should update if the resource is created by the current user.', function () {
    $params = [
        "name" => fake()->name(),
        "subdomain" => "mytest"
    ];

    $this->patchJson("/api/workspaces/{$this->workspace->id}", $params)
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.name', $params['name'])
                ->where('data.subdomain', $params['subdomain']);
        });
});

it('should update if the current user is an admin.', function () {
    // logged in as an admin
    Sanctum::actingAs($this->user2);

    $params = [
        "name" => fake()->name(),
        "subdomain" => "mytest"
    ];

    $this->patchJson("/api/workspaces/{$this->workspace->id}", $params)
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.name', $params['name'])
                ->where('data.subdomain', $params['subdomain']);
        });
});

it('should not update on non existing workspace.', function () {
    $params = [
        "name" => "test",
        "subdomain" => "mytest"
    ];

    $this->patchJson("/api/workspaces/1000", $params)
        ->assertNotFound()
        ->assertJson(['data' => ['message' => 'Resource not found.']]);
});

it('should update a workspace when the request data is valid.', function () {
    $params = [
        "name" => fake()->name(),
        "subdomain" => "mytest"
    ];

    $this->patchJson("/api/workspaces/{$this->workspace->id}", $params)
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.name', $params['name'])
                ->where('data.subdomain', $params['subdomain']);
        });
});

it('should fail when deleting a resource if user does not created it.', function () {
    // logged in with a different user account 
    $user3 = User::factory()->create();
    $workspace = Workspace::factory()->hasAttached($user3, [], 'members')->create(['user_id' => $user3->id]);

    $this->deleteJson("/api/workspaces/{$workspace->id}")
        ->assertForbidden();
});

it('should delete if the resource is created by the current user.', function () {
    $this->deleteJson("/api/workspaces/{$this->workspace->id}")
        ->assertOk()
        ->assertJson([
            "data" => [
                "message" => $this->workspace->name . " has been deleted successfully."
            ]
        ]);
});

it('should delete if the current user is an admin.', function () {
    // logged in as an admin
    Sanctum::actingAs($this->user2);

    $this->deleteJson("/api/workspaces/{$this->workspace->id}")
        ->assertOk()
        ->assertJson([
            "data" => [
                "message" => $this->workspace->name . " has been deleted successfully."
            ]
        ]);
});

it('should fail when deleting a workspace with non existing workspace id.', function () {
    $this->deleteJson("/api/workspaces/1111")
        ->assertNotFound()
        ->assertJson(['data' => ['message' => 'Resource not found.']]);
});

it('should delete a workspace given a valid workspace id.', function () {
    $this->deleteJson("/api/workspaces/{$this->workspace->id}")
        ->assertOk()
        ->assertJson([
            "data" => [
                "message" => $this->workspace->name . " has been deleted successfully."
            ]
        ]);
});
