<?php

namespace App\Http\Controllers;

use App\Http\Resources\StatusResource;
use App\Models\Status;
use App\Models\Workspace;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Workspace $workspace, Request $request)
    {
        $visible = $request->query('visible') ?? false;
        $load_items = $request->query('load_items') ?? false;
        $query = Status::where('workspace_id', '=', $workspace->id);
       
        if ($visible) {
            $query->where('visibility', '=', $visible);
        }

        $statuses = $query->get();

        if ($load_items) {
            $statuses->load(['boardItems' => function ($query) {
                $query->withCount(['item_votes'])->orderByDesc('item_votes_count');
            }]);
        }
        

        return StatusResource::collection($statuses);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Workspace $workspace, Request $request)
    {
        $params = $request->validate([
            'name' => ['required', 'string', 'min:1', 'max:256']
        ]);

        if ($request->has('position')) {
            $params['position'] = $request->position;
        }

        if ($request->has('visibility')) {
            $params['visibility'] = $request->visibility;
        }

        $status = $workspace->statuses()->create($params);

        return new StatusResource($status);
    }

    /**
     * Display the specified resource.
     */
    public function show(Workspace $workspace, Status $status)
    {
        return new StatusResource($status);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Workspace $workspace, Status $status)
    {
        if ($request->user()->cannot('update', $workspace)) {
            abort(403);
        }

        $params = $request->validate([
            'name' => ['required', 'string', 'min:1', 'max:256']
        ]);


        if ($request->has('position')) {
            $status->position = $request->position;
        }

        if ($request->has('visibility')) {
            $status->visibility = $request->visibility;
        }

        $status->name = $params['name'];
        $status->save();

        return new StatusResource($status);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workspace $workspace, Status $status, Request $request)
    {
        if ($request->user()->cannot('delete', $workspace)) {
            abort(403);
        }

        $status->delete();

        return response()->json(["data" => ["message" => "{$status->name} has been deleted successfully."]]);
    }
}
