<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Deposit extends Model
{
    protected $fillable = ['user_id','amount','proof_url','status','admin_note','approved_at'];
    protected $casts    = ['amount' => 'decimal:2', 'approved_at' => 'datetime'];
    public function user() { return $this->belongsTo(User::class); }
}
