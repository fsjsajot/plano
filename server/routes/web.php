<?php

use App\Http\Controllers\CSRFController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

require __DIR__ . '/auth.php';

Route::prefix('/api')->middleware('auth')->group(function () {
    Route::post('/workspace', [WorkspaceController::class, 'store']);
    Route::patch('/workspace/{workspaceId}', [WorkspaceController::class, 'update']);
    Route::delete('/workspace/{workspaceId}', [WorkspaceController::class, 'destroy']);
});
