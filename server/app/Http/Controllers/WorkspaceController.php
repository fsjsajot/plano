<?php

namespace App\Http\Controllers;

use App\Events\WorkspaceCreated;
use App\Http\Resources\WorkspaceResource;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WorkspaceController extends Controller
{
    public function index(Request $request)
    {
        $authUser = Auth::user();

        $workspaces = [];
        if ($request->query('include') == 'all') { // this will include workspaces that user was invited and joined to
            $workspaces = $authUser->assignedWorkspaces;
        } else {
            $workspaces = Workspace::where('user_id', '=', $authUser->id)->orderBy('created_at')->get();
        }

        return WorkspaceResource::collection($workspaces);
    }

    public function show(Workspace $workspace)
    {
        return new WorkspaceResource($workspace);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $params = $request->validate([
            'name' => ['required']
        ]);

        $user = Auth::user();

        $params['user_id'] = $user->id;

        if ($request->has('description')) {
            $params['description'] = $request->description;
        }

        $workspace = $user->workspaces()->create($params);

        WorkspaceCreated::dispatch($user, $workspace);

        return new WorkspaceResource($workspace);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Workspace $workspace, Request $request)
    {
        if ($request->user()->cannot('update', $workspace)) {
            abort(403);
        }

        $params = $request->validate([
            'name' => ['required']
        ]);

        $workspace->name = $params["name"];

        if ($request->has('description')) {
            $workspace->description = $request->description;
        }

        $workspace->save();

        return new WorkspaceResource($workspace);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workspace $workspace, Request $request)
    {
        if ($request->user()->cannot('delete', $workspace)) {
            abort(403);
        }

        $workspace->delete();

        return response()->json(["data" => ["message" => "{$workspace->name} has been deleted successfully."]]);
    }
}
