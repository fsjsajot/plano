<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserAvatarUploadController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $request->validate([
            'avatar' => ['file', 'image', 'required']
        ]);

        $user = $request->user();

        $directoryName = "public/avatars/{$user->id}";

        if (Storage::directoryExists($directoryName)) {
            Storage::deleteDirectory($directoryName);
        }

        $path = $request->file('avatar')->store($directoryName);

        $user->avatar = $path;
        $user->save();

        return new UserResource($user);
    }
}
