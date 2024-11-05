<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BoardItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "title" => $this->title,
            "description" => $this->description,
            "status_id" => $this->status_id,
            "board_id" => $this->board_id,
            "author" => new UserResource($this->whenLoaded('user')),
            "votes" => ItemVoteResource::collection($this->whenLoaded('itemVotes')),
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
    }
}
