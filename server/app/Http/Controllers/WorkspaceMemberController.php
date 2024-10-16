<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\Request;

class WorkspaceMemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Workspace $workspace)
    {
        return UserResource::collection($workspace->members);
    }

    /**
     * Display the specified resource.
     */
    public function show(Workspace $workspace, string $memberId)
    {
        $member = $workspace->members()->find($memberId);

        return response()->json(['data' => $member]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workspace $workspace, User $member)
    {
        $workspace->members()->detach($member->id);

        return response()->json(['data' => ['message' => 'Removed user to workspace.']]);
    }
}
