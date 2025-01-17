<?php

namespace App\Providers;

use App\Models\Workspace;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (App::environment('local')) {
            DB::listen(function (QueryExecuted $query) {
                if (config('app.debug')) {
                    $sql = Str::replaceArray('?', $query->bindings, $query->sql);
                    Log::channel('database')->debug($sql);
                }
            });
        }

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url') . "/password-reset/$token?email=" . urlencode($notifiable->getEmailForPasswordReset());
        });

        Route::bind('workspace', function (string $value) {
            return Workspace::with('owner')->where('id', '=', $value)->firstOrFail();
        });

    }
}
