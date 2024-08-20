<?php

use App\Models\Board;
use App\Models\BoardItem;
use App\Models\Status;
use App\Models\User;
use App\Models\Workspace;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->workspace =  Workspace::factory()->create(['user_id' => $this->user->id]);
    $this->status = Status::factory()->create(['workspace_id' => $this->workspace->id]);
    $this->board = Board::factory()->for($this->workspace)->create();
    $this->user->workspaces()->attach($this->workspace);

    Sanctum::actingAs($this->user);
});

it('should return all items of the board.', function () {
    $items = BoardItem::factory(15)->for($this->board)->create(['status_id' => $this->status->id]);

    $workspaceId = $this->workspace->id;
    $boardId = $this->board->id;

    $data = $this->getJson("/api/workspaces/$workspaceId/boards/$boardId/items")->json()['data'];
 
    expect($data)->toHaveCount(15);
    expect($items[0]->title)->toBe($data[0]['title']);
});

it('should return a single item of the board.', function () {
    $item = BoardItem::factory()->for($this->board)->create(['status_id' => $this->status->id]);

    $workspaceId = $this->workspace->id;
    $boardId = $this->board->id;

    $response = $this->getJson("/api/workspaces/$workspaceId/boards/$boardId/items/$item->id")->json();
    $data = $response['data'];

    expect($data['title'])->toBe($item->title);
});

it('should not create a board item when request is invalid.', function () {
    $this->withExceptionHandling();
    $params = ['title' => '', 'description' => ''];

    $workspaceId = $this->workspace->id;
    $boardId = $this->board->id;

    $this->postJson("/api/workspaces/$workspaceId/boards/$boardId/items", $params)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['title']);;
});

it('should create a board item when request is valid.', function () {
    $this->withExceptionHandling();
    $workspaceId = $this->workspace->id;
    $boardId = $this->board->id;

    $params = BoardItem::factory()->raw([
        'status_id' => $this->status->id,
        'board_id' => $this->board->id
    ]);

    $response = $this->postJson("/api/workspaces/$workspaceId/boards/$boardId/items", $params)
        ->assertCreated();

    $response->assertJsonFragment($params);
});

it('should not update a board item when request is invalid.', function () {
    $this->withExceptionHandling();
    $item = BoardItem::factory()->for($this->board)->create(['status_id' => $this->status->id]);
    $params = ['title' => '', 'description' => ''];

    $workspaceId = $this->workspace->id;
    $boardId = $this->board->id;

    $this->patchJson("/api/workspaces/$workspaceId/boards/$boardId/items/$item->id", $params)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'status_id']);
});

it('should update a board item when request is valid.', function () {
    $this->withExceptionHandling();
    $workspaceId = $this->workspace->id;
    $boardId = $this->board->id;

    $item = BoardItem::factory()->for($this->board)->create(['status_id' => $this->status->id]);
    $newStatus =  Status::factory()->create(['workspace_id' => $this->workspace->id]);


    $params = [
        'title' => 'updated title',
        'description' => 'updated description',
        'status_id' => $newStatus->id
    ];

    $response = $this->patchJson("/api/workspaces/$workspaceId/boards/$boardId/items/$item->id", $params)
        ->assertOk();

    $response->assertJsonFragment($params);
});

it('should not delete a non existing board item.', function() {
    $this->withExceptionHandling();
    $workspaceId = $this->workspace->id;
    $boardId = $this->board->id;

    $this->deleteJson("/api/workspaces/$workspaceId/boards/$boardId/items/100000")
        ->assertNotFound()
        ->assertJson(['data' => ['message' => 'Resource not found.']]);
});

it('should delete a board item.', function() {
    $this->withExceptionHandling();
    $workspaceId = $this->workspace->id;
    $boardId = $this->board->id;

    $item = BoardItem::factory()->for($this->board)->create(['status_id' => $this->status->id]);

    $this->deleteJson("/api/workspaces/$workspaceId/boards/$boardId/items/$item->id")
        ->assertOk()
        ->assertJson(['data' => ['message' => $item->title . " has been deleted successfully."]]);

    
    $this->getJson("/api/workspaces/$workspaceId/boards/$boardId/items/$item->id")
        ->assertNotFound()
        ->assertJson(['data' => ['message' => 'Resource not found.']]);
});