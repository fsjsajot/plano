<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemCommentResource extends JsonResource
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
            "comment" => $this->comment,
            "author" => new UserResource($this->user),
            "board_item_id" => $this->board_item_id,
            "parent_id" => $this->parent_id,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "depth" => $this->depth,
            "children" => $this->when(!empty($this->children), ItemCommentResource::collection($this->children))
        ];
    }
}
