<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\BoardItemController;
use App\Http\Controllers\BoardItemFileController;
use App\Http\Controllers\ItemCommentController;
use App\Http\Controllers\ItemVoteController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->group(function() {
    Route::apiResource('workspaces', WorkspaceController::class);
    Route::apiResource('workspaces.statuses', StatusController::class);
    Route::apiResource('workspaces.boards', BoardController::class);
    Route::apiResource('workspaces.boards.items', BoardItemController::class);
    Route::apiResource('workspaces.boards.items.comments', ItemCommentController::class)->except('show');
    Route::apiResource('workspaces.boards.items.votes', ItemVoteController::class)->only(['store', 'destroy']);
    Route::apiResource('workspaces.boards.items.files', BoardItemFileController::class)->only(['store', 'destroy', 'index']);
});