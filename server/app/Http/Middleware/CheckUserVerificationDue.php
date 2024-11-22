<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserVerificationDue
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()->isNotDisabled()) {
            Auth::guard('web')->logout();

            $request->session()->invalidate();
    
            $request->session()->regenerateToken();

            abort(401, 'User is disabled.');
        }

        return $next($request);
    }
}
