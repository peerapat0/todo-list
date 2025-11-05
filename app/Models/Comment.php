<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Todo;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'todo_id',
        'user_id',
        'content',
        'image',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function todo()
    {
        return $this->belongsTo(Todo::class);
    }
}
