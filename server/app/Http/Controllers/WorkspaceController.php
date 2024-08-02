<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use App\Http\Requests\StoreWorkspaceRequest;
use App\Http\Requests\UpdateWorkspaceRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Nette\NotImplementedException;
use Symfony\Component\Translation\Exception\NotFoundResourceException;

class WorkspaceController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWorkspaceRequest $request)
    {
        $authUser = Auth::user();

        $user = User::find($authUser->id);

        $workspace = $user->workspaces()->create($request->validated());

        return response()->json(["data" => $workspace]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(int $workspaceId, UpdateWorkspaceRequest $updateWorkspaceRequest)
    {
        $params = $updateWorkspaceRequest->validated();
        $workspace = Workspace::findOrFail($workspaceId);

        $workspace->name = $params["name"];
        $workspace->subdomain = $params["subdomain"];

        $workspace->save();

        return response()->json(["data" => $workspace]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $workspaceId)
    {
        $workspace = Workspace::findOrFail($workspaceId);

        $workspace->delete();

        return response()->json(["data" => ["message" => $workspace->name . " has been deleted successfully."]]);
    }
}
