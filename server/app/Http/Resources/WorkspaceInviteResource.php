<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkspaceInviteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'token' => $this->token,
            'invite_type' => $this->invite_type,
            "workspace" => $this->workspace,
            "disabled_at" => $this->disabled_at,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "invite_url" => config('app.frontend_url') . "/invite/{$this->workspace_id}/{$this->token}"
        ];
    }
}
