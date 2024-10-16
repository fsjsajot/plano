<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Workspace extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'user_id'
    ];

    public function owner(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_workspaces', 'workspace_id', 'user_id')->withTimestamps();
    }

    public function statuses(): HasMany
    {
        return $this->hasMany(Status::class);
    }

    public function boards(): HasMany
    {
        return $this->hasMany(Board::class);
    }
}
