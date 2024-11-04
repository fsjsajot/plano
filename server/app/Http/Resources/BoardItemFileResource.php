<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

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
            "type" => $this->type,
            "board_item_id" => $this->board_item_id,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "size" => Storage::disk('public')->size($this->path),
            "width" => getimagesize(Storage::disk('public')->path($this->path))[0],
            "height" => getimagesize(Storage::disk('public')->path($this->path))[1],
            "url" => asset(Storage::url($this->path))
        ];
    }
}
