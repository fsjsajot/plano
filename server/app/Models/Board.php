<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Board extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'workspace_id'];

    public function workspace() : BelongsTo {
        return $this->belongsTo(Workspace::class);
    }
}
