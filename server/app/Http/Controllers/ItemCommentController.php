<?php

namespace App\Http\Controllers;

use App\Http\Resources\ItemCommentResource;
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
        $comments = ItemComment::treeOf(fn($query) => $query->isRoot()->where('board_item_id', $item->id), 3)->orderBy('created_at')->get()->toTree();

        return ItemCommentResource::collection($comments);
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

        return new ItemCommentResource($comment);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Workspace $workspace, Board $board, BoardItem $item, ItemComment $comment, Request $request)
    {
        if ($request->user()->cannot('update', [$comment, $workspace])) {
            abort(403);
        }

        $validatedData = $request->validate(['comment' => ['required']]);
        $comment->comment = $validatedData['comment'];
        $comment->save();

        return new ItemCommentResource($comment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workspace $workspace, Board $board, BoardItem $item, ItemComment $comment, Request $request)
    {
        if ($request->user()->cannot('delete', [$comment, $workspace])) {
            abort(403);
        }

        $comment->delete();

        return response()->json(["data" => ["message" => "Comment has been deleted successfully."]]);
    }
}
