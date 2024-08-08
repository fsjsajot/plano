<?php

use App\Http\Controllers\StatusController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

require __DIR__ . '/auth.php';

Route::prefix('/api')->middleware('auth')->group(function () {
    Route::apiResource('workspaces', WorkspaceController::class);
    Route::apiResource('workspaces.statuses', StatusController::class);
});
