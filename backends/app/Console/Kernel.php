<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        // Release income every 18 hours
        $schedule->command('income:release')->everySixHours();
        // For exact 18h, use a cron: '0 */18 * * *'
        // $schedule->command('income:release')->cron('0 */18 * * *');
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}
