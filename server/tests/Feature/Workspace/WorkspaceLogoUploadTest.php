<?php

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->workspace = Workspace::factory()->hasAttached($this->user, [], 'members')->create(['user_id' => $this->user->id]);
    
    Storage::fake('public');
    Sanctum::actingAs($this->user);
});

it('should error when no image is passed', function() {
    $this->postJson("/api/workspaces/{$this->workspace->id}/upload", [])
    ->assertJsonValidationErrors(['logo'])
    ->assertInvalid(['logo' => 'The logo field is required.']);
});

it('should error when uploading a non-image logo', function() {
    $params = [
        'logo' => UploadedFile::fake()->create("test.txt")
    ];

    $this->postJson("/api/workspaces/{$this->workspace->id}/upload", $params)
        ->assertJsonValidationErrors(['logo'])
        ->assertInvalid(['logo' => 'The logo field must be an image.']);
});

it('should upload a new logo and update the workspace logo path.', function() {
    $params = [
        'logo' => UploadedFile::fake()->image('test.png')
    ];

    $response = $this->postJson("/api/workspaces/{$this->workspace->id}/upload", $params)
    ->assertOk()
    ->json()['data'];

    Storage::assertExists($response['logoPath']);
});