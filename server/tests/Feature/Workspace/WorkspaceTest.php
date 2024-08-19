<?php

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Str;


describe('validate workspace form request', function () {
    it('should not create a workspace when the required fields are missing.', function () {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->postJson("/api/workspaces", []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'subdomain']);
    });

    it('should not create a workspace when subdomain is more than 255 characters', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson("/api/workspaces", [
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
        $response = $this->actingAs($user)->patchJson("/api/workspaces/{$workspace->id}", []);

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

        $response = $this->actingAs($user)->patchJson("/api/workspaces/{$workspace->id}", $params);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['subdomain']);
    });
});

it('should return the same number of workspaces created for the user.', function() {
    $user = User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    $workspaces = Workspace::factory(10)->create([
        'user_id' => $user->id
    ]);

    $user->workspaces()->attach($workspaces);

    $response = $this->actingAs($user)->getJson("/api/workspaces");
    $data = $response->decodeResponseJson()['data'];

    $response->assertStatus(200);
    expect(count($data))->toBe(10);
});


it('should create a workspace when the request data is valid.', function () {
    $user = User::factory()->create();

    $params = [
        "user_id" => $user->id,
        "name" => fake()->name(),
        "subdomain" => fake()->word()
    ];

    $response = $this->actingAs($user)
        ->postJson("/api/workspaces", $params);

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
        ->patchJson("/api/workspaces/1000", $params);


    $response->assertStatus(404);
    $response->assertJson(['data' => ['message' => 'Resource not found.']]);
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
        ->patchJson("/api/workspaces/{$workspace->id}", $params);


    $response->assertStatus(200);
    $response->assertJsonFragment($params);

    $latestWorkspace = Workspace::find($workspace->id);

    expect($latestWorkspace->name)->toBe($params["name"]);
    expect($latestWorkspace->subdomain)->toBe($params["subdomain"]);
});

it('should fail when deleting a workspace with non existing workspace id.', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->deleteJson("/api/workspaces/1111");

    $response->assertStatus(404);
    $response->assertJson(['data' => ['message' => 'Resource not found.']]);
});

it('should delete a workspace given a valid workspace id.', function () {
    $workspace = Workspace::factory()->create();
    $user = User::find($workspace->user_id);
    $user->workspaces()->attach($workspace);
    $newUser = User::find($user->id)->withCount('workspaces')->get()->first();

    expect($newUser->workspaces_count)->toBe(1);

    $response = $this->actingAs($user)->deleteJson("/api/workspaces/$workspace->id");


    $newUser = User::find($user->id)->withCount('workspaces')->get()->first();
    expect($newUser->workspaces_count)->toBe(0);

    $response->assertStatus(200);
    $response->assertJson(["data" => [
        "message" => $workspace->name . " has been deleted successfully."
    ]]);


    $response = $this->actingAs($user)->getJson("/api/workspaces/$workspace->id");

    $response->assertStatus(404);
    $response->assertJson(['data' => ['message' => 'Resource not found.']]);
});
