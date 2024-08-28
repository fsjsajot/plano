<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardItem;
use App\Models\ItemComment;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ItemCommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Workspace $workspace, Board $board, BoardItem $item)
    {
        $comments = $item->commentsWithReplies();

        return response()->json(["data" => $comments]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Workspace $workspace, Board $board, BoardItem $item, Request $request)
    {
        $validatedData = $request->validate(['comment' => ['required']]);
        $params = ["user_id" => Auth::user()->id, "comment" => $validatedData["comment"]];

        if ($request->exists('parent_id')) {
            $params['parent_id'] = $request->parent_id;
        }

        $comment = $item->comments()->create($params);

        return response()->json(["data" => $comment], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Workspace $workspace, Board $board, BoardItem $item, ItemComment $comment, Request $request)
    {
        $validatedData = $request->validate(['comment' => ['required']]);
        $comment->comment = $validatedData['comment'];
        $comment->save();

        return response()->json(["data" => $comment]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workspace $workspace, Board $board, BoardItem $item, ItemComment $comment)
    {
        $comment->delete();

        return response()->json(["data" => ["message" => "Comment has been deleted successfully."]]);
    }
}
