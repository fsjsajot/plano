<?php

use App\Models\Board;
use App\Models\BoardItem;
use App\Models\ItemVote;
use App\Models\Status;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->workspace = Workspace::factory()->create(['user_id' => $this->user->id]);
    $this->status = Status::factory()->create(['workspace_id' => $this->workspace->id]);
    $this->board = Board::factory()->for($this->workspace)->create();
    $this->user->workspaces()->attach($this->workspace);

    $this->item = BoardItem::factory()->for($this->board)->create(['status_id' => $this->status->id]);

    Sanctum::actingAs($this->user);
});


it('should create an item vote when there are no existing record.', function () {
    $this->postJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/votes")
        ->assertCreated()
        ->assertJson(
            fn(AssertableJson $json) =>
            $json->has('data')
                ->where('data.id', 1)
                ->where('data.user_id', $this->user->id)
                ->where('data.board_item_id', $this->item->id)
        );
});

it('should return the existing record when creating new record.', function () {
    // create an item vote record
    $this->postJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/votes")
        ->assertCreated()
        ->assertJson(
            fn(AssertableJson $json) =>
            $json->has('data')
                ->where('data.id', 2)
                ->where('data.user_id', $this->user->id)
                ->where('data.board_item_id', $this->item->id)
        );

    // create new item vote record under the same user and board item
    $this->postJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/votes")
        ->assertCreated()
        ->assertJson(
            fn(AssertableJson $json) =>
            $json->has('data')
                ->where('data.id', 2)
                ->where('data.user_id', $this->user->id)
                ->where('data.board_item_id', $this->item->id)
        );
});

it('should delete the item vote record.', function () {
    $response = $this->postJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/votes")
        ->assertCreated()
        ->json()['data'];

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/votes/{$response['id']}")
        ->assertNoContent();

    $itemVote = ItemVote::find($response['id']);
    expect($itemVote)->toBeNull();
});