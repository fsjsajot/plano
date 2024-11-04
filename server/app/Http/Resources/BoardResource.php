<?php

namespace App\Http\Resources;

use App\Models\BoardItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BoardResource extends JsonResource
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
            "name" => $this->name,
            "description" => $this->description,
            "workspace_id" => $this->workspace_id,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "items" => BoardItemResource::collection($this->whenLoaded('boardItems'))
        ];
    }
}
