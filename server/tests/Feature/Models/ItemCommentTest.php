<?php

use App\Models\Board;
use App\Models\BoardItem;
use App\Models\ItemComment;
use App\Models\Status;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->user2 = User::factory()->create();
    $this->user3 = User::factory()->create();
    $this->user4 = User::factory()->create();
    $this->workspace = Workspace::factory()->create(['user_id' => $this->user->id]);
    $this->status = Status::factory()->create(['workspace_id' => $this->workspace->id]);
    $this->board = Board::factory()->for($this->workspace)->create();
    $this->user->workspaces()->attach($this->workspace);
    $this->item = BoardItem::factory()->for($this->board)->create(['status_id' => $this->status->id]);

    Sanctum::actingAs($this->user);
});

it('should display all root comments in a board item.', function () {
    ItemComment::factory(10)->for($this->item)->create(['user_id' => $this->user->id]);

    $this->getJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/comments")
        ->assertOk()
        ->assertJson(function (AssertableJson $json) {
            $json->has('data')
                ->has('data.comments', 10);
        });
});

it('should display all root comments and replies in a board item.', function () {
    // root comments
    $root1 = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user->id]);
    $root2 = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user2->id]);
    $root3 = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user3->id]);

    // 2nd level comments
    $secondLevel1 = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user2->id, 'parent_id' => $root1->id]);
    $secondLevel2 = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user3->id, 'parent_id' => $root1->id]);
    $secondLevel3 = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user4->id, 'parent_id' => $root1->id]);

    $secondLevel4 = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user->id, 'parent_id' => $root2->id]);
    $secondLevel5 = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user->id, 'parent_id' => $root2->id]);

    $secondLevel6 = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user->id, 'parent_id' => $root3->id]);
    $secondLevel7 = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user->id, 'parent_id' => $root3->id]);

    // 3rd level comments (last)
    $thirdLevel1 = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user4->id, 'parent_id' => $secondLevel1->id]);
    $thirdLevel2 = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user4->id, 'parent_id' => $secondLevel1->id]);
    $thirdLevel3 = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user2->id, 'parent_id' => $secondLevel4->id]);
    $thirdLevel4 = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user3->id, 'parent_id' => $secondLevel7->id]);


    // assert
    $this->getJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/comments")
        ->assertOk()
        ->assertJson(function (AssertableJson $json) {
            $json->has('data')
                ->has('data.comments', 3)

                ->has('data.comments.0.children', 3)
                ->has('data.comments.0.children.0.children', 2)

                ->has('data.comments.1.children', 2)
                ->has('data.comments.1.children.0.children', 1)

                ->has('data.comments.2.children', 2)
                ->has('data.comments.2.children.1.children', 1);
        });
});

it('should not create an item comment when request is invalid.', function () {
    $params = ['comment' => ''];

    $this->postJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/comments", $params)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['comment']);
    ;
});

it('should create a root item comment when request is valid.', function () {
    $params = ItemComment::factory()->for($this->item)->raw(['user_id' => $this->user->id]);

    $this->postJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/comments", $params)
        ->assertCreated()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.comment', $params['comment'])
                ->where('data.user_id', $params['user_id'])
                ->where('data.board_item_id', $params['board_item_id']);
        });
});

it('should create a reply item comment on a root item comment when request is valid.', function () {
    $rootComment = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user->id]);

    $params = ItemComment::factory()->for($this->item)->raw(['user_id' => $this->user->id, 'parent_id' => $rootComment->id]);

    $this->postJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/comments", $params)
        ->assertCreated()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.comment', $params['comment'])
                ->where('data.user_id', $params['user_id'])
                ->where('data.parent_id', $params['parent_id'])
                ->where('data.board_item_id', $params['board_item_id']);
        });
});

it('should not update an item comment when request is invalid.', function () {
    $params = ['comment' => ''];
    $comment = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user->id]);


    $this->patchJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/comments/{$comment->id}", $params)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['comment']);
});

it('should update an item comment when request is valid.', function () {
    $comment = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user->id]);
    $params = ["comment" => "test comment"];

    $this->patchJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/comments/{$comment->id}", $params)
        ->assertOk()
        ->assertJson(function (AssertableJson $json) use ($params) {
            $json->has('data')
                ->where('data.comment', "test comment");
        });
});

it('should not delete a non existing item comment.', function () {
    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/comments/100000")
        ->assertNotFound()
        ->assertJson(['data' => ['message' => 'Resource not found.']]);
});

it('should delete a board item.', function () {
    $comment = ItemComment::factory()->for($this->item)->create(['user_id' => $this->user->id]);

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->item->id}/comments/{$comment->id}")
        ->assertOk()
        ->assertJson(['data' => ['message' => "Comment has been deleted successfully."]]);
});