<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mood extends Model
{
    protected $fillable = ['label', 'emoji', 'color'];

    public function dailyLogs(): HasMany
    {
        return $this->hasMany(DailyLog::class);
    }
}
