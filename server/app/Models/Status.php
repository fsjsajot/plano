<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Status extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'position',
        'visibility',
        'workspace_id',
    ];

    protected $casts = [
        "position" => "float"
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function boardItem(): BelongsTo
    {
        return $this->belongsTo(BoardItem::class);
    }
}
