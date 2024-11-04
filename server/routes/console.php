<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// disable user if not verified 14 days after registration
Schedule::call(function () {
    User::whereNull('verified_at')
        ->where('created_at', '<', Carbon::now()->subWeeks(2))
        ->where('user_role_id', 2)
        ->update(['disabled_at' => now()]);
})->daily();

Artisan::command('logs:clear', function() {
    exec('echo "" > ' . storage_path('logs/laravel.log'));
    $this->info('Logs have been cleared');
})->describe('Clear log files');