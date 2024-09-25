<?php

namespace App\Http\Controllers;

use App\Http\Resources\BoardItemFileResource;
use App\Models\Board;
use App\Models\BoardItem;
use App\Models\BoardItemFile;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


class BoardItemFileController extends Controller
{
    public function index(Workspace $workspace, Board $board, BoardItem $item)
    {
        $boardItemFiles = $item->files;
        return BoardItemFileResource::collection($boardItemFiles);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Workspace $workspace, Board $board, BoardItem $item)
    {
        if ($request->user()->cannot('create', [$item, $workspace])) {
            abort(403);
        }

        $request->validate([
            "files" => ['required', 'array'],
            "files.*" => ['file', 'image', 'max:10240']
        ]);

        $files = $request->file('files');
        $boardItemFiles = [];

        foreach ($files as $file) {
            $type = $file->getMimeType();
            $filepath = Storage::disk('public')->putFileAs("files/board/{$item->id}", $file, $file->hashName());

            $boardItemFiles[] = [
                "name" => $file->hashName(),
                "path" => $filepath,
                "type" => $type
            ];
        }


        $uploaded = $item->files()->createMany($boardItemFiles);
        $uploadedFiles = $uploaded->count();


        return response()->json(['data' => ["message" => "{$uploadedFiles} " . ($uploadedFiles > 1 ? 'files' : 'file') . " has been uploaded successfully."]]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workspace $workspace, Board $board, BoardItem $item, BoardItemFile $file, Request $request)
    {
        if ($request->user()->cannot('delete', [$item, $workspace])) {
            abort(403);
        }

        if (Storage::disk('public')->exists($file->path)) {
            $result = Storage::disk('public')->delete($file->path);

            if ($result) {
                $file->delete();

                return response()->json(['data' => ["message" => "{$file->name} has been deleted successfully."]]);
            } else {
                return response()->json(['data' => ['message' => 'Failed to delete the file.']], 500);
            }

        } else {
            throw new NotFoundHttpException();
        }
    }
}
