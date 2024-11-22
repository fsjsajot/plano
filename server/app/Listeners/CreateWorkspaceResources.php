<?php

namespace App\Listeners;

use App\Events\ResourceCreated;
use App\Events\WorkspaceCreated;
use App\Models\Board;
use App\Models\Status;
use Illuminate\Contracts\Queue\ShouldQueue;

class CreateWorkspaceResources implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(WorkspaceCreated $event): void
    {
        logger()->info("Processing WorkspaceCreated event for {$event->workspace->id}");

        // create default statuses
        Status::create([
            'name' => 'New',
            'position' => 1,
            'visibility' => true,
            'workspace_id' => $event->workspace->id
        ]);

        Status::create([
            'name' => 'In Progress',
            'position' => 2,
            'visibility' => true,
            'workspace_id' => $event->workspace->id
        ]);

        Status::create([
            'name' => 'Completed',
            'position' => 3,
            'visibility' => true,
            'workspace_id' => $event->workspace->id
        ]);

        // create default board
        Board::create([
            'name' => 'My Board',
            'workspace_id' => $event->workspace->id
        ]);

        // sends a websocket message to client to refetch
        ResourceCreated::dispatch();
    }
}
