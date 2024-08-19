<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BoardItemFile extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'path', 'type', 'board_item_id'];

    public function boardItem() : BelongsTo {
        return $this->belongsTo(BoardItem::class);
    }
}
