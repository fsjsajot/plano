<?php

namespace App\Http\Controllers;

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

        return response()->json(['data' => $boards]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Workspace $workspace, Request $request)
    {
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'min:0', 'max:256']
        ]);

        $board = $workspace->boards()->create($validatedData);

        return response()->json(['data' => $board], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Workspace $workspace, Board $board)
    {
        return response()->json(['data' => $board]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Workspace $workspace, Request $request, Board $board)
    {
        if ($request->user()->cannot('update', $workspace)) {
            abort(403);
        }

        $validatedData = $request->validate([
            'name' => ['required', 'string', 'min:0', 'max:256']
        ]);

        $board->name = $validatedData['name'];

        $board->save();

        return response()->json(['data' => $board]);
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