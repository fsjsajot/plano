<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function show(Request $request)
    {
        $userWithWorkspaces = $request->user()->load(['workspaces']);

        return new UserResource($userWithWorkspaces);
    }

    public function update_profile(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255'],
        ]);

        $user = $request->user();

        $user->name = $request->name;

        if ($user->email != $request->email) {
            $request->validate([
                'email' => ['unique:' . User::class]
            ]);
        }

        $user->email = $request->email;
        $user->save();

        return new UserResource($user);
    }

    public function update_password(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'string', 'current_password'],
            'new_password' => ['required', 'string', 'min:8'],
        ]);

        $user = $request->user();
        $user->password = Hash::make($request->string('new_password'));
        $user->save();

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
 }
