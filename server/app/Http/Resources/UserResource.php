<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
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
            "email" => $this->email,
            "email_verified_at" => $this->email_verified_at,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "user_role_id" => $this->user_role_id,
            "workspaces" => WorkspaceResource::collection($this->whenLoaded('workspaces')),
            "avatar_url" => $this->when(!is_null($this->avatar), asset(Storage::url($this->avatar)))
        ];
    }
}
