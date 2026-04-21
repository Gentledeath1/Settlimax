<?php

namespace Database\Seeders;

use App\Models\{User, Setting};
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::updateOrCreate(['email' => env('ADMIN_EMAIL', 'admin@settlimax.com')], [
            'name'           => env('ADMIN_NAME', 'Settlimax Admin'),
            'password'       => env('ADMIN_PASSWORD', 'Admin@1234'),
            'role'           => 'admin',
            'referral_code'  => 'ADMINCODE',
            'wallet_balance' => 0,
            'is_active'      => true,
        ]);

        // Default settings
        $defaults = [
            'welcome_bonus'        => '800',
            'daily_login_bonus'    => '50',
            'referral_signup_bonus'=> '20',
            'referral_commission'  => '5',
            'withdrawal_charge'    => '15',
            'min_withdrawal'       => '800',
            'income_interval_hours'=> '18',
            'bank_name'            => 'GTBank',
            'account_name'         => 'Settlimax Investment',
            'account_number'       => '0123456789',
            'telegram_link'        => 'https://t.me/settlimax',
        ];

        foreach ($defaults as $key => $value) {
            Setting::firstOrCreate(['key' => $key], ['value' => $value]);
        }

        $this->command->info('Seeder done. Admin: ' . env('ADMIN_EMAIL', 'admin@settlimax.com'));
    }
}
