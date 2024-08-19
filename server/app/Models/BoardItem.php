<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class BoardItem extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'status_id', 'board_id'];

    public function status() : HasOne {
        return $this->hasOne(Status::class);
    }

    public function files() : HasMany {
        return $this->hasMany(BoardItemFile::class);
    }

    public function board() : BelongsTo {
        return $this->belongsTo(Board::class);
    }
}
