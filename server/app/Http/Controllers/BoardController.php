<?php

namespace App\Http\Controllers;

use App\Http\Resources\BoardResource;
use App\Models\Board;
use App\Models\Workspace;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Workspace $workspace)
    {
        $boards = $workspace->boards;

        return BoardResource::collection($boards);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Workspace $workspace, Request $request)
    {
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'min:0', 'max:256'],
            'description' => ['nullable']
        ]);

        $board = $workspace->boards()->create($validatedData);

        return new BoardResource($board);
    }

    /**
     * Display the specified resource.
     */
    public function show(Workspace $workspace, Board $board)
    {
        $board->load(['boardItems.user']);
        
        return new BoardResource($board);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Workspace $workspace, Request $request, Board $board)
    {
        if ($request->user()->cannot('update', $workspace)) {
            abort(403);
        }

        $request->validate([
            'name' => ['required', 'string', 'min:0', 'max:256'],
            'description' => ['nullable']
        ]);

        $board->name = $request->name;

        if ($request->has('description')) {
            $board->description = $request->description;
        }

        $board->save();

        return new BoardResource($board);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workspace $workspace, Board $board, Request $request)
    {
        if ($request->user()->cannot('delete', $workspace)) {
            abort(403);
        }

        $board->delete();

        return response()->json(["data" => ["message" => "{$board->name} has been deleted successfully."]]);
    }
}
