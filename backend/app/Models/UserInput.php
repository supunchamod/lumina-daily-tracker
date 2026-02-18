<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserInput extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'font_family',
        'text_color',
        'background_color',
        'font_size',
        'tag',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
