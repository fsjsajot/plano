<?php

use App\Models\Board;
use App\Models\BoardItem;
use App\Models\BoardItemFile;
use App\Models\Status;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->workspace = Workspace::factory()->create(['user_id' => $this->user->id]);
    $this->status = Status::factory()->create(['workspace_id' => $this->workspace->id]);
    $this->board = Board::factory()->for($this->workspace)->create();
    $this->boardItem = BoardItem::factory()->for($this->board)->create(['status_id' => $this->status->id]);
    $this->user->workspaces()->attach($this->workspace);

    Storage::fake('public');
    Sanctum::actingAs($this->user);
});


it('should not upload a non-image files.', function () {
    $files = [
        "files" => [
            UploadedFile::fake()->image('demo.png'),
            UploadedFile::fake()->create('demo.mp4', 1024),
            UploadedFile::fake()->create('demo.pdf', 512)
        ]
    ];

    $this->postJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->boardItem->id}/files", $files)
        ->assertUnprocessable()
        ->assertInvalid([
            'files.1' => 'The files.1 field must be an image.',
            'files.2' => 'The files.2 field must be an image.',
        ]);
});

it('should not upload a large image filesize.', function () {
    $files = [
        "files" => [
            UploadedFile::fake()->create('test.jpg', 12288),
            UploadedFile::fake()->image('demo.png'),
        ]
    ];

    $this->postJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->boardItem->id}/files", $files)
        ->assertUnprocessable()
        ->assertInvalid([
            'files.0' => 'The files.0 field must not be greater than 10240 kilobytes.',
        ]);
});

it('shoud fail when no files in request payload.', function () {
    $files = [];

    $this->postJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->boardItem->id}/files", $files)
        ->assertUnprocessable()
        ->assertInvalid([
            "files" => "The files field is required."
        ]);
});

it('should upload an image and create the associated record.', function () {
    $files = [
        "files" => [
            UploadedFile::fake()->image('test.jpg'),
            UploadedFile::fake()->image('demo.png'),
        ]
    ];

    $this->postJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->boardItem->id}/files", $files)
        ->assertOk()
        ->assertJson(["data" => ["message" => "2 files has been uploaded successfully."]]);

    $response = $this->getJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->boardItem->id}/files")
        ->assertOk()
        ->assertJson(
            fn(AssertableJson $json) =>
            $json->has('data', 2)
                ->where('data.0.id', 1)
                ->where('data.1.id', 2)
        )
        ->json()['data'];

    Storage::disk('public')->assertExists([$response[0]['path'], $response[1]['path']]);
});

it('should not error when file is missing.', function () {
    $boardItemFile = BoardItemFile::factory()->create(['board_item_id' => $this->boardItem->id]);

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->boardItem->id}/files/{$boardItemFile->id}")
        ->assertNotFound()
        ->assertJson(["data" => ["message" => "Resource not found."]]);
});

it('should delete the file and its associated record.', function () {
    $files = [
        "files" => [
            UploadedFile::fake()->image('demo.png'),
        ]
    ];

    $this->postJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->boardItem->id}/files", $files)
        ->assertOk()
        ->assertJson(["data" => ["message" => "1 file has been uploaded successfully."]]);

    $boardItemFile = $this->getJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->boardItem->id}/files")
        ->assertOk()
        ->assertJson(
            fn(AssertableJson $json) =>
            $json->has('data', 1)
        )
        ->json()['data'][0];

    Storage::disk('public')->assertExists($boardItemFile['path']);

    $this->deleteJson("/api/workspaces/{$this->workspace->id}/boards/{$this->board->id}/items/{$this->boardItem->id}/files/{$boardItemFile['id']}")
        ->assertOk()
        ->assertJson(["data" => ["message" => "{$boardItemFile['name']} has been deleted successfully."]]);

    Storage::disk('public')->assertMissing($boardItemFile['path']);
});