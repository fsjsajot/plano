<?php

namespace App\Http\Controllers;

use App\Models\Status;
use App\Http\Requests\StoreStatusRequest;
use App\Http\Requests\UpdateStatusRequest;
use App\Models\Workspace;

class StatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Workspace $workspace)
    {
       $statuses = $workspace->statuses()->get(); 

       return response()->json(["data" => $statuses]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Workspace $workspace, StoreStatusRequest $request)
    {
        $params = $request->validated();
        $params['workspace_id'] =  $workspace->id;

        $status = Status::create($params);

        return response()->json(["data" => $status], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Workspace $workspace, Status $status)
    {
        return response()->json(["data" => $status]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStatusRequest $request, Workspace $workspace, Status $status)
    {
        $params = $request->validated();

        $status->name = $params['name'];
        $status->save();

        return response()->json(["data" => $status]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workspace $workspace, Status $status)
    {
        $status->delete();

        return response()->json(["data" => ["message" => $status->name . " has been deleted successfully."]]);
    }
}
