<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Withdrawal extends Model
{
    protected $fillable = [
        'user_id','amount','bank_name','account_name','account_number',
        'status','admin_note','processed_at',
    ];
    protected $casts = ['amount' => 'decimal:2', 'processed_at' => 'datetime'];
    public function user() { return $this->belongsTo(User::class); }
}
