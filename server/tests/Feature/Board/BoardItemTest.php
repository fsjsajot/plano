<?php

use App\Models\Board;
use App\Models\BoardItem;
use App\Models\Status;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->user = User::factory()->create(); // workspace owner account
    $this->user2 = User::factory()->create(); // standard account
    $this->user3 = User::factory()->create(['user_role_id' => 1]); // admin account

    $this->workspace = Workspace::factory()->create(['user_id' => $this->user->id]);
    $this->status = Status::factory()->create(['workspace_id' => $this->workspace->id]);
    $this->board = Board::factory()->for($this->workspace)->create();
    $this->user->workspaces()->attach($this->workspace);

    $this->boardItem = BoardItem::factory()->for($this->board)->for($this->user)->create(['status_id' => $this->status->id]);
    Sanctum::actingAs($this->user);
});

it('should return all items of the board.', function () {
    $board2 = Board::factory()->for($this->workspace)->create();
    BoardItem::factory(20)->for($board2)->for($this->user)->create(['status_id' => $this->status->id]);

    $this->getJson("/api/workspaces/{$this->workspace->id}/boards/{$board2->id}/items")
        ->assertOk()
        ->assertJson(function (AssertableJson $json) {
            $json
                ->has('data', 20);
        });
});

it('should return a single item of the board.', function () {
    $this->getJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->boardItem->id}")
        ->assertOk()
        ->assertJson(function (AssertableJson $json) {
            $json
                ->has('data')
                ->where('data.title', $this->boardItem->title);
        });
});

it('should not create a board item when request is invalid.', function () {
    $params = ['title' => '', 'description' => ''];

    $this->postJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items", $params)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'status_id'])
        ->assertJson(function (AssertableJson $json) {
            $json->where('errors.title.0', 'The title field is required.')
                ->where('errors.status_id.0', 'The status id field is required.')
                ->etc();
        });
});

it('should create a board item when request is valid.', function () {
    $params = BoardItem::factory()->raw([
        'status_id' => $this->status->id,
    ]);

    $this->postJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items", $params)
        ->assertCreated()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.title', $params['title'])
                ->where('data.statusId', $params['status_id']);
        });
});

it('should fail when updating a resource if user does not created it.', function () {
    // logged in with a different user account 
    Sanctum::actingAs($this->user2);

    $params = [
        'title' => 'updated title',
        'description' => 'updated description'
    ];

    $this->patchJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->boardItem->id}", $params)
        ->assertForbidden();
});

it('should update if the resource is created by the current user.', function () {
    Sanctum::actingAs($this->user2);

    $newItem = BoardItem::factory()->for($this->board)->for($this->user2)->create(['status_id' => $this->status->id]);
    $newStatus = Status::factory()->create(['workspace_id' => $this->workspace->id]);

    $params = [
        'title' => 'updated title',
        'description' => 'updated description',
        'status_id' => $newStatus->id
    ];

    $this->patchJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$newItem->id}", $params)
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.title', "updated title")
                ->where('data.description', "updated description");
        });
});

it('should update if the current user is a workspace owner.', function () {
    $newItem = BoardItem::factory()->for($this->board)->for($this->user2)->create(['status_id' => $this->status->id]);
    $newStatus = Status::factory()->create(['workspace_id' => $this->workspace->id]);

    $params = [
        'title' => 'updated title',
        'description' => 'updated description',
        'status_id' => $newStatus->id
    ];

    $this->patchJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$newItem->id}", $params)
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.title', "updated title")
                ->where('data.description', "updated description");
        });
});

it('should update if the current user is an admin.', function () {
    // logged in as an admin
    Sanctum::actingAs($this->user3);

    $newItem = BoardItem::factory()->for($this->board)->for($this->user2)->create(['status_id' => $this->status->id]);
    $newStatus = Status::factory()->create(['workspace_id' => $this->workspace->id]);

    $params = [
        'title' => 'updated title',
        'description' => 'updated description',
        'status_id' => $newStatus->id
    ];

    $this->patchJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$newItem->id}", $params)
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.title', "updated title")
                ->where('data.description', "updated description");
        });
});

it('should not update a board item when request is invalid.', function () {
    $params = ['title' => '', 'description' => '', 'status_id' => ''];

    $this->patchJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->boardItem->id}", $params)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'status_id'])
        ->assertJson(function (AssertableJson $json) {
            $json->where('errors.title.0', 'The title field is required.')
                ->where('errors.status_id.0', 'The status id field is required.')
                ->etc();
        });
});

it('should update a board item when request is valid.', function () {
    $newStatus = Status::factory()->create(['workspace_id' => $this->workspace->id]);

    $params = [
        'title' => 'updated title',
        'description' => 'updated description',
        'status_id' => $newStatus->id
    ];

    $this->patchJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->boardItem->id}", $params)
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.title', $params['title'])
                ->where('data.description', $params['description'])
                ->where('data.statusId', $params['status_id']);
        });
});

it('should fail when deleting a resource if the current user does not created it.', function () {
    // logged in with different user account
    Sanctum::actingAs($this->user2);

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->boardItem->id}")
        ->assertForbidden();
});

it('should delete if the resource is created by the current user.', function () {
    // logged in with different user account
    Sanctum::actingAs($this->user2);

    $newItem = BoardItem::factory()->for($this->board)->for($this->user2)->create(['status_id' => $this->status->id]);

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$newItem->id}")
        ->assertOk()
        ->assertJson(['data' => ['message' => "{$newItem->title} has been deleted successfully."]]);
});

it('should delete if the current user is a workspace owner.', function () {
    $newItem = BoardItem::factory()->for($this->board)->for($this->user2)->create(['status_id' => $this->status->id]);

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$newItem->id}")
        ->assertOk()
        ->assertJson(['data' => ['message' => "{$newItem->title} has been deleted successfully."]]);
});

it('should delete if the current user is an admin.', function () {
    // logged in as an admin
    Sanctum::actingAs($this->user3);

    $newItem = BoardItem::factory()->for($this->board)->for($this->user2)->create(['status_id' => $this->status->id]);

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$newItem->id}")
        ->assertOk()
        ->assertJson(['data' => ['message' => "{$newItem->title} has been deleted successfully."]]);
});

it('should not delete a non existing board item.', function () {
    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/100000")
        ->assertNotFound()
        ->assertJson(['data' => ['message' => 'Resource not found.']]);
});

it('should delete a board item.', function () {
    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->boardItem->id}")
        ->assertOk()
        ->assertJson(['data' => ['message' => "{$this->boardItem->title} has been deleted successfully."]]);
});