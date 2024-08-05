<?php

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Str;


describe('validate workspace form request', function () {
    it('should not create a workspace when the required fields are missing.', function () {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->postJson("/api/workspace", []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'subdomain', 'user_id']);
    });

    it('should not create a workspace when subdomain is more than 255 characters', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson("/api/workspace", [
                "user_id" => $user->id,
                "name" => fake()->name(),
                "subdomain" => Str::repeat("test", 75)
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['subdomain']);
    });

    it('should not update a workspace when the required fields are missing.', function () {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create([
            'user_id' => $user->id
        ]);
        $response = $this->actingAs($user)->patchJson("/api/workspace/{$workspace->id}", []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'subdomain']);
    });

    it('should not update a workspace when subdomain is more than 255 characters', function () {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create([
            'user_id' => $user->id
        ]);

        $params = [
            "user_id" => $user->id,
            "name" => fake()->name(),
            "subdomain" => Str::repeat("test", 75)
        ];

        $response = $this->actingAs($user)->patchJson("/api/workspace/{$workspace->id}", $params);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['subdomain']);
    });
});


it('should create a workspace when the request data is valid.', function () {
    $user = User::factory()->create();

    $params = [
        "user_id" => $user->id,
        "name" => fake()->name(),
        "subdomain" => fake()->word()
    ];

    $response = $this->actingAs($user)
        ->postJson("/api/workspace", $params);

    $response->assertStatus(200);
    $response->assertJsonFragment($params);

    $user = User::find($user->id)->withCount('workspaces')->get()->first();
    expect($user->workspaces_count)->toBe(1);
});

it('should not update on non existing workspace.', function () {
    $user = User::factory()->create();

    $params = [
        "name" => "test",
        "subdomain" => "mytest"
    ];


    $response = $this->actingAs($user)
        ->patchJson("/api/workspace/1000", $params);


    $response->assertStatus(404);
    $response->assertJson(["message" => "Record not found."]);
});

it('should update a workspace when the request data is valid.', function () {
    $user = User::factory()->create();
    $workspace = Workspace::factory()->create([
        'user_id' => $user->id
    ]);

    $params = [
        "user_id" => $user->id,
        "name" => fake()->name(),
        "subdomain" => "mytest"
    ];

    $response = $this->actingAs($user)
        ->patchJson("/api/workspace/{$workspace->id}", $params);


    $response->assertStatus(200);
    $response->assertJsonFragment($params);

    $latestWorkspace = Workspace::find($workspace->id);

    expect($latestWorkspace->name)->toBe($params["name"]);
    expect($latestWorkspace->subdomain)->toBe($params["subdomain"]);
});

it('should fail when deleting a workspace with non existing workspace id.', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->deleteJson("/api/workspace/1111");

    $response->assertStatus(404);
    $response->assertJson(["message" => "Record not found."]);
});

it('should delete a workspace given a valid workspace id.', function () {
    $workspace = Workspace::factory()->create();
    $user = User::find($workspace->user_id);
    $user->workspaces()->attach($workspace);
    $newUser = User::find($user->id)->withCount('workspaces')->get()->first();

    expect($newUser->workspaces_count)->toBe(1);

    $response = $this->actingAs($user)->deleteJson("/api/workspace/$workspace->id");


    $newUser = User::find($user->id)->withCount('workspaces')->get()->first();
    expect($newUser->workspaces_count)->toBe(0);

    $response->assertStatus(200);
    $response->assertJson(["data" => [
        "message" => $workspace->name . " has been deleted successfully."
    ]]);
});
