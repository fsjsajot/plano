<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardItem;
use App\Models\ItemVote;
use App\Models\Workspace;
use Illuminate\Http\Request;

class ItemVoteController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Workspace $workspace, Board $board, BoardItem $item)
    {
        $itemVote = ItemVote::createOrFirst([
            'user_id' => auth()->user()->id,
            'board_item_id' => $item->id
        ]);

        return response()->json(['data' => $itemVote], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workspace $workspace, Board $board, BoardItem $item, ItemVote $vote)
    {
        $vote->delete();

        return response()->noContent();
    }
}
