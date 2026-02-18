<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reward extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'xp_cost',
        'icon',
        'times_redeemed',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
