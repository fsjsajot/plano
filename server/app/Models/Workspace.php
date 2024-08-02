<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workspace extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'subdomain',
        'user_id'
    ];

    public function members() {
        return $this->belongsToMany(User::class)->withTimestamps();
    }
}
