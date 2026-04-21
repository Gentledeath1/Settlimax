<?php

namespace App\Http\Controllers;

use App\Models\Setting;

class SettingsController extends Controller
{
    public function bankDetails()
    {
        return response()->json(['success' => true, 'data' => [
            'bank_name'      => Setting::get('bank_name'),
            'account_name'   => Setting::get('account_name'),
            'account_number' => Setting::get('account_number'),
        ]]);
    }
}
