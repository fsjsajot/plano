<?php

namespace App\Policies;

use App\Models\ItemComment;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Auth\Access\Response;

class ItemCommentPolicy
{

    public function before(User $user, string $ability) : bool | null {
        if ($user->userRole->role == 0) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ItemComment $comment, Workspace $workspace): bool
    {
        return $comment->user_id == $user->id || $workspace->user_id == $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ItemComment $comment, Workspace $workspace): bool
    {
        return $comment->user_id == $user->id || $workspace->user_id == $user->id;
    }
}
