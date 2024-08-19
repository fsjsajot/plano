<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardItem;
use App\Models\Workspace;
use Illuminate\Http\Request;

class BoardItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Workspace $workspace, Board $board)
    {
        $boardItems = $board->boardItems;
        return response()->json(['data' => $boardItems]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Workspace $workspace, Board $board, Request $request)
    {
        $validatedData = $request->validate([
            'title' => ['required', 'string'],
            'description' => ['nullable'],
            'status_id' => ['required']
        ]);

        $validatedData['board_id'] = $board->id;

        $item = $board->boardItems()->create($validatedData);
        return response()->json(['data' => $item], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Workspace $workspace, Board $board, BoardItem $item)
    {
        return response()->json(['data' => $item]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Workspace $workspace, Board $board, Request $request, BoardItem $item)
    {
        $validatedData = $request->validate([
            'title' => ['required', 'string'],
            'description' => ['nullable'],
            'status_id' => ['required']
        ]);

        $item->title = $validatedData['title'];
        $item->description = $validatedData['description'];
        $item->status_id = $validatedData['status_id'];

        $item->save();

        return response()->json(['data' => $item]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workspace $workspace, Board $board, BoardItem $item)
    {
        $item->delete();


        return response()->json(["data" => ["message" => $item->title . " has been deleted successfully."]]);
    }
}
