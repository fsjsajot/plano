<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemVote extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'board_item_id'];
}
