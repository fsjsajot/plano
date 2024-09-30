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
    $this->user2 = User::factory()->create();
    $this->workspace = Workspace::factory()->hasAttached($this->user, [], 'members')->create(['user_id' => $this->user->id]);
    $this->status = Status::factory()->create(['workspace_id' => $this->workspace->id]);
    $this->board = Board::factory()->for($this->workspace)->create();

    $this->item = BoardItem::factory()->for($this->board)->for($this->user)->create(['status_id' => $this->status->id]);

    Sanctum::actingAs($this->user);
});


it('should create an item vote.', function () {
    $this->postJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/votes")
        ->assertCreated()
        ->assertJson(
            fn(AssertableJson $json) =>
            $json->has('data')
                ->where('data.id', 1)
                ->where('data.userId', $this->user->id)
                ->where('data.boardItemId', $this->item->id)
        );
});

it('should fail if other user uncast a vote', function () {
    $itemVote = ItemVote::create([
        'board_item_id' => $this->item->id,
        'user_id' => $this->user2->id
    ]);

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/votes/{$itemVote->id}")
        ->assertForbidden();
});

it('should delete the item vote record.', function () {
    $itemVote = ItemVote::create([
        'board_item_id' => $this->item->id,
        'user_id' => $this->user->id
    ]);

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/votes/{$itemVote->id}")
        ->assertNoContent();
});