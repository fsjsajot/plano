<?php

namespace App\Http\Controllers;

use App\Http\Resources\WorkspaceResource;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WorkspaceLogoUploadController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Workspace $workspace, Request $request)
    {
        $request->validate([
            'logo' => ['file', 'image', 'required']
        ]);

        $directoryName = "public/logos/{$workspace->id}";

        if (Storage::directoryExists($directoryName)) {
            Storage::deleteDirectory($directoryName);
        }

        $path = $request->file('logo')->store($directoryName);

        $workspace->logo_path = $path;
        $workspace->save();

        return new WorkspaceResource($workspace);
    }
}
