<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'phone', 'password',
        'role', 'wallet_balance', 'referral_code',
        'referred_by', 'is_active', 'last_login_at',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at'     => 'datetime',
        'wallet_balance'    => 'decimal:2',
        'is_active'         => 'boolean',
        'password'          => 'hashed',
    ];

    /* ── Relationships ── */
    public function investments()
    {
        return $this->hasMany(Investment::class);
    }

    public function deposits()
    {
        return $this->hasMany(Deposit::class);
    }

    public function withdrawals()
    {
        return $this->hasMany(Withdrawal::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function referrals()
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    public function referrer()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    /* ── Helpers ── */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function credit(float $amount, string $description, string $reference = null): void
    {
        DB::transaction(function () use ($amount, $description, $reference) {
            $this->increment('wallet_balance', $amount);
            $this->transactions()->create([
                'amount'      => $amount,
                'type'        => 'credit',
                'description' => $description,
                'reference'   => $reference ?? 'TXN-' . strtoupper(Str::random(10)),
                'status'      => 'completed',
            ]);
        });
    }

    public function debit(float $amount, string $description, string $reference = null): void
    {
        DB::transaction(function () use ($amount, $description, $reference) {
            $this->decrement('wallet_balance', $amount);
            $this->transactions()->create([
                'amount'      => $amount,
                'type'        => 'debit',
                'description' => $description,
                'reference'   => $reference ?? 'TXN-' . strtoupper(Str::random(10)),
                'status'      => 'completed',
            ]);
        });
    }
}
