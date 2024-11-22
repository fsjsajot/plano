<?php

namespace App\Events;

use App\Models\Workspace;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WorkspaceCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;

    public $workspace;

    /**
     * Create a new event instance.
     */
    public function __construct(Authenticatable $user, Workspace $workspace)
    {
        $this->user = $user;
        $this->workspace = $workspace;
    }
}
