<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\BoardItemController;
use App\Http\Controllers\BoardItemFileController;
use App\Http\Controllers\ItemCommentController;
use App\Http\Controllers\ItemVoteController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\UserAvatarUploadController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\WorkspaceInviteController;
use App\Http\Controllers\WorkspaceLogoUploadController;
use App\Http\Controllers\WorkspaceMemberController;
use Illuminate\Support\Facades\Route;

// invite by shareable link
Route::apiResource('workspaces.invites', WorkspaceInviteController::class)->only(['store', 'destroy']);
Route::get('workspaces/{workspace}/invites/{token?}', [WorkspaceInviteController::class, 'show']);
Route::post('workspaces/{workspace}/invites/{token}/accept', [WorkspaceInviteController::class, 'acceptInvite']);

Route::apiResource('workspaces.boards.items.files', BoardItemFileController::class)->only(['show']);

// invite by email
Route::get('workspaces/{workspace}/invited/{token}', [WorkspaceInviteController::class, 'acceptEmailInvite'])->middleware(['auth:sanctum']);

Route::middleware(['auth:sanctum', 'user_status_check'])->get('/user', [UserController::class, "show"])->name("current.user");

Route::middleware(['auth:sanctum', 'user_status_check'])->group(function () {
    Route::patch("/user/profile", [UserController::class, 'update_profile']);
    Route::patch("/user/password", [UserController::class, 'update_password']);
    Route::post("/user/profile/upload", UserAvatarUploadController::class);

    Route::apiResource('workspaces', WorkspaceController::class);
    Route::apiResource('workspaces.statuses', StatusController::class);
    Route::apiResource('workspaces.boards', BoardController::class);
    Route::apiResource('workspaces.boards.items', BoardItemController::class);
    Route::apiResource('workspaces.boards.items.comments', ItemCommentController::class)->except('show');
    Route::apiResource('workspaces.boards.items.votes', ItemVoteController::class)->only(['store', 'destroy']);
    Route::apiResource('workspaces.boards.items.files', BoardItemFileController::class)->only(['store', 'destroy', 'index']);

    Route::get('workspaces/{workspace}/members/{memberId}', [WorkspaceMemberController::class, 'show']);
    Route::apiResource('workspaces.members', WorkspaceMemberController::class)->only(['index', 'destroy']);

    Route::post('workspaces/{workspace}/upload', WorkspaceLogoUploadController::class);
});