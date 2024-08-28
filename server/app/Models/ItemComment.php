<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Staudenmeir\LaravelAdjacencyList\Eloquent\HasRecursiveRelationships;

class ItemComment extends Model
{
    use HasFactory;
    use HasRecursiveRelationships;

    protected $fillable = ['user_id', 'comment', 'parent_id'];

    public function boardItem()
    {
        return $this->belongsTo(BoardItem::class);
    }

    public function replies() {
        $constraint = function ($query) {
            $query->whereNull('parent_id')->where('board_item_id', $this->board_item_id);
        };

        return $this->treeOf($constraint)->get()->toTree();
    }
}
