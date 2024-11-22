<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StatusResource extends JsonResource
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
            "position" => $this->position,
            "visibility" => $this->visibility,
            "workspace_id" => $this->workspace_id,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "items" => BoardItemResource::collection($this->whenLoaded('boardItems'))
        ];
    }
}
