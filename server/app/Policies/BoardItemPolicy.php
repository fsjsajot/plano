<?php

namespace App\Policies;

use App\Models\BoardItem;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Auth\Access\Response;

class BoardItemPolicy
{

    public function before(User $user, string $ability): bool|null
    {
        if ($user->userRole->role == 0) {
            return true;
        }

        return null;
    }

    public function create(User $user, BoardItem $item, Workspace $workspace)
    {
        return $item->user_id == $user->id || $workspace->user_id == $user->id;
    }
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, BoardItem $item, Workspace $workspace): bool
    {
        return $item->user_id == $user->id || $workspace->user_id == $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, BoardItem $item, Workspace $workspace): bool
    {
        return $item->user_id == $user->id || $workspace->user_id == $user->id;
    }
}
