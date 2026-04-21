<?php

namespace App\Console\Commands;

use App\Models\Investment;
use Illuminate\Console\Command;

class ReleaseIncome extends Command
{
    protected $signature   = 'income:release';
    protected $description = 'Release daily income for all active investments (runs every 18 hours)';

    public function handle(): void
    {
        $investments = Investment::with('user')
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('last_income_at')
                  ->orWhere('last_income_at', '<=', now()->subHours(18));
            })
            ->get();

        $count = 0;

        foreach ($investments as $investment) {
            $investment->increment('days_elapsed');

            $investment->user->credit(
                $investment->daily_income,
                "Daily income — {$investment->plan_name}"
            );

            $investment->update(['last_income_at' => now()]);

            // Mark complete if cycle done or end date reached
            if ($investment->days_elapsed >= 25 || now()->greaterThanOrEqualTo($investment->ends_at)) {
                $investment->update(['status' => 'completed']);
            }

            $count++;
        }

        $this->info("Income released for {$count} investments.");
    }
}
