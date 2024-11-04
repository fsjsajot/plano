<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function show(Request $request)
    {
        $userWithWorkspaces = $request->user()->load(['workspaces']);

        return new UserResource($userWithWorkspaces);
    }
}
