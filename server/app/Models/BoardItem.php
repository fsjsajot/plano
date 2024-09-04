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

    protected $fillable = ['title', 'description', 'status_id', 'board_id', 'user_id'];

    public function status(): HasOne
    {
        return $this->hasOne(Status::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(BoardItemFile::class);
    }

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function itemVotes(): HasMany
    {
        return $this->hasMany(ItemVote::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ItemComment::class);
    }

    public function commentsWithReplies()
    {
        return $this->setRelation(
            'comments',
            ItemComment::treeOf(fn($query) => $query->isRoot()->where('board_item_id', $this->id))->get()->toTree()
        );
    }
}
