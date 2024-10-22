<?php

use App\Mail\InviteMember;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvite;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->workspace = Workspace::factory()->hasAttached($this->user, [], 'members')->create(['user_id' => $this->user->id]);

    Sanctum::actingAs($this->user);
});

it('should return the first matched workspace invite if no token param is provided.', function () {
    $invite = WorkspaceInvite::factory()->create(['workspace_id' => $this->workspace->id]);

    $this->getJson("/api/workspaces/{$this->workspace->id}/invites")
        ->assertOk()
        ->assertJson(function (AssertableJson $assertableJson) use ($invite) {
            $assertableJson->has('data')
                ->where('data.id', $invite->id)
                ->where('data.workspace.id', $invite->workspace_id)
                ->where('data.token', $invite->token);
        });
});

it('should return the first matched workspace invite if token param is provided.', function () {
    $invite2 = WorkspaceInvite::factory()->create(['workspace_id' => $this->workspace->id]);

    $this->getJson("/api/workspaces/{$this->workspace->id}/invites", ['token' => $invite2->token])
        ->assertOk()
        ->assertJson(function (AssertableJson $assertableJson) use ($invite2) {
            $assertableJson->has('data')
                ->where('data.id', $invite2->id)
                ->where('data.workspace.id', $invite2->workspace_id)
                ->where('data.token', $invite2->token);
        });
});

it('should return an error if workspace invite is disabled.', function () {
    WorkspaceInvite::factory()->create(['workspace_id' => $this->workspace->id, 'disabled_at' => Carbon::now()]);

    $this->getJson("/api/workspaces/{$this->workspace->id}/invites")
        ->assertNotFound();
});

it('should return a validation error if invite_type value is not provided.', function () {
    $this->postJson("/api/workspaces/{$this->workspace->id}/invites", [])
        ->assertUnprocessable()
        ->assertInvalid(['invite_type' => 'The invite type field is required.']);
});

it('should validate array of email value if invite_type is 1.', function () {
    $this->postJson("/api/workspaces/{$this->workspace->id}/invites", ['invite_type' => 1])
        ->assertUnprocessable()
        ->assertInvalid(['emails' => 'The emails field is required.']);
});

it('should create a shareable workspace invite if invite type is 2.', function () {
    $this->postJson("/api/workspaces/{$this->workspace->id}/invites", ['invite_type' => 2])
        ->assertCreated()
        ->assertJson(function (AssertableJson $assertableJson) {
            $assertableJson
                ->where('data.inviteType', 2)
                ->where('data.workspace.id', $this->workspace->id);
        });
});

it('should return the existing shareable workspace invite if invite type is 2.', function () {
    $invite = WorkspaceInvite::factory()->create(['workspace_id' => $this->workspace->id]);

    $this->postJson("/api/workspaces/{$this->workspace->id}/invites", ['invite_type' => 2])
        ->assertOk()
        ->assertJson(function (AssertableJson $assertableJson) use ($invite) {
            $assertableJson
                ->where('data.id', $invite->id)
                ->where('data.token', $invite->token)
                ->where('data.inviteType', 2)
                ->where('data.workspace.id', $this->workspace->id);
        });
});

it('should generate unique workspace invite for each email address if invite type is 1.', function () {
    $params = [
        'invite_type' => 1,
        'emails' => [
            fake()->unique()->email(),
            fake()->unique()->email(),
        ]
    ];

    $this->postJson("/api/workspaces/{$this->workspace->id}/invites", $params)
        ->assertOk()
        ->assertJson(['data' => ['message' => 'Successfully sent email invitations.']]);
});

it('should sent email invitations for each email address if invite type is 1.', function () {
    Mail::fake();

    $params = [
        'invite_type' => 1,
        'emails' => [
            fake()->unique()->email(),
            fake()->unique()->email(),
            fake()->unique()->email(),
        ]
    ];

    $this->postJson("/api/workspaces/{$this->workspace->id}/invites", $params)
        ->assertOk()
        ->assertJson(['data' => ['message' => 'Successfully sent email invitations.']]);

    Mail::assertQueued(InviteMember::class);
    Mail::assertQueuedCount(3);
});
