<?php

namespace App\Http\Controllers;

use App\Http\Resources\BoardItemResource;
use App\Models\Board;
use App\Models\BoardItem;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BoardItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Workspace $workspace, Board $board)
    {
        $boardItems = $board->boardItems;
        return BoardItemResource::collection($boardItems);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Workspace $workspace, Board $board, Request $request)
    {
        $validatedData = $request->validate([
            'title' => ['required', 'string'],
            'description' => ['required'],
            'status_id' => ['nullable']
        ]);

        $validatedData['user_id'] = Auth::user()->id;

        $item = $board->boardItems()->create($validatedData);

        return new BoardItemResource($item);
    }

    /**
     * Display the specified resource.
     */
    public function show(Workspace $workspace, Board $board, BoardItem $item)
    {
        $item->load(['user']);
        $item->loadCount(['itemVotes']);

        return new BoardItemResource($item);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Workspace $workspace, Board $board, Request $request, BoardItem $item)
    {
        if ($request->user()->cannot('update', [$item, $workspace])) {
            abort(403);
        }

        $validatedData = $request->validate([
            'title' => ['required', 'string'],
            'description' => ['required'],
            'status_id' => ['nullable']
        ]);

        $item->title = $validatedData['title'];
        $item->description = $validatedData['description'];

        if ($request->has('status_id')) {
            $item->status_id = $request->status_id == 0 ? null : $request->status_id;
        }

        $item->save();

        return new BoardItemResource($item);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workspace $workspace, Board $board, BoardItem $item, Request $request)
    {
        if ($request->user()->cannot('delete', [$item, $workspace])) {
            abort(403);
        }

        $item->delete();

        return response()->json(["data" => ["message" => "{$item->title} has been deleted successfully."]]);
    }
}
