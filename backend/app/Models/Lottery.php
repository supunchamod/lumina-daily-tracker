<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lottery extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'image',
        'price',
        'draw_date',
        'total_tickets',
        'tickets_sold',
        'status',
        'winning_numbers',
    ];

    protected function casts(): array
    {
        return [
            'price'           => 'decimal:2',
            'draw_date'       => 'datetime',
            'winning_numbers' => 'array',
            'tickets_sold'    => 'integer',
            'total_tickets'   => 'integer',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────

    public function ticketsRemaining(): int
    {
        return $this->total_tickets - $this->tickets_sold;
    }

    public function isSoldOut(): bool
    {
        return $this->tickets_sold >= $this->total_tickets;
    }
}
