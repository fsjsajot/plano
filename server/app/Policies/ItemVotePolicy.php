<?php

namespace App\Policies;

use App\Models\BoardItem;
use App\Models\ItemVote;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ItemVotePolicy
{
    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ItemVote $itemVote): bool
    {
        return $user->id == $itemVote->user_id;
    }
}
