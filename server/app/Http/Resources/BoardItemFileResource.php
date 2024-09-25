<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BoardItemFileResource extends JsonResource
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
            "path" => $this->path,
            "type" => $this->type,
            "board_item_id" => $this->board_item_id,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at
        ];
    }
}
