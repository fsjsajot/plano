<?php

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->user2 = User::factory()->create();
    $this->user3 = User::factory()->create();
    $this->workspace = Workspace::factory()->hasAttached([$this->user, $this->user2, $this->user3], [], 'members')->create(['user_id' => $this->user->id]);

    Sanctum::actingAs($this->user);
});

it('should list all members of a workspace', function () {
    $this->getJson("/api/workspaces/{$this->workspace->id}/members")
        ->assertOk()
        ->assertJson(function (AssertableJson $assertableJson) {
            $assertableJson->has('data', 3)
                ->where('data.0.id', $this->user->id)
                ->where('data.1.id', $this->user2->id)
                ->where('data.2.id', $this->user3->id);
        });
});

it('should return null if member id is not present', function () {
    $this->getJson("/api/workspaces/{$this->workspace->id}/members/12313333")
        ->assertOk()
        ->assertJson(function (AssertableJson $assertableJson) {
            $assertableJson->where('data', null);
        });
});

it('should return specific member of a workspace given the member id', function () {
    $this->getJson("/api/workspaces/{$this->workspace->id}/members/{$this->user2->id}")
        ->assertOk()
        ->assertJson(function (AssertableJson $assertableJson) {
            $assertableJson->has('data')
                ->where('data.id', $this->user2->id)
                ->where('data.name', $this->user2->name)
                ->where('data.email', $this->user2->email);
        });
});


it('should return a not found error if member id is not present when removing a member', function () {
    $this->deleteJson("/api/workspaces/{$this->workspace->id}/members/12313333")
        ->assertNotFound()
        ->assertJson(["data" => ["message" => "Resource not found."]]);
});

it('should remove the user in the workspace', function () {
    expect($this->workspace->members()->count())
        ->toBe(3);

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/members/{$this->user2->id}")
        ->assertOk()
        ->assertJson(["data" => ["message" => "Removed user to workspace."]]);

    expect($this->workspace->members()->count())
        ->toBe(2);
});