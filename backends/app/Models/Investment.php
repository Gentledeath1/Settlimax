<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Investment extends Model
{
    protected $fillable = [
        'user_id', 'tier', 'plan_name', 'amount',
        'daily_income', 'total_return', 'days_elapsed',
        'status', 'last_income_at', 'ends_at'
    ];

    protected $casts = [
        'last_income_at' => 'datetime',
        'ends_at' => 'datetime',
        'cost' => 'decimal:2',
        'daily_income' => 'decimal:2',
        'total_return' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}