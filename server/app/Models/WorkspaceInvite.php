<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkspaceInvite extends Model
{
    protected $table = 'workspace_invitations';
    use HasFactory;

    protected $fillable = [
        'invite_type',
        'workspace_id',
        'email',
        'token'
    ];

    public function workspace() : BelongsTo {
        return $this->belongsTo(Workspace::class);
    }
}
