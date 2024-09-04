<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use App\Http\Requests\StoreWorkspaceRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WorkspaceController extends Controller
{
    public function index()
    {
        $authUser = Auth::user();
        $workspaces = Workspace::where('user_id', $authUser->id)->orderBy('created_at', 'asc')->get();

        return response()->json(["data" => $workspaces]);
    }

    public function show(Workspace $workspace)
    {
        return response()->json(["data" => $workspace]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => ['required'],
            'subdomain' => ['required', 'min:1', 'max:255']
        ]);

        $user = Auth::user();

        $validatedData['user_id'] = $user->id;
        $workspace = $user->workspaces()->create($validatedData);

        return response()->json(["data" => $workspace]);
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
            'name' => ['required'],
            'subdomain' => ['required', 'min:1', 'max:255'],
        ]);

        $workspace->name = $params["name"];
        $workspace->subdomain = $params["subdomain"];

        $workspace->save();

        return response()->json(["data" => $workspace]);
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
