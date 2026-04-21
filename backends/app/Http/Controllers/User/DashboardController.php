<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Investment;
use App\Models\Setting;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    const PLANS = [
        1 => ['name' => 'Stack 1', 'cost' => 3000, 'daily' => 750, 'total' => 18750],
        2 => ['name' => 'Stack 2', 'cost' => 5000, 'daily' => 1250, 'total' => 31250],
        3 => ['name' => 'Stack 3', 'cost' => 7000, 'daily' => 1750, 'total' => 43750],
        4 => ['name' => 'Stack 4', 'cost' => 10000, 'daily' => 2500, 'total' => 62500],
        5 => ['name' => 'Stack 5', 'cost' => 15000, 'daily' => 3750, 'total' => 93750],
        6 => ['name' => 'Stack 6', 'cost' => 20000, 'daily' => 5000, 'total' => 125000],
        7 => ['name' => 'Stack 7', 'cost' => 25000, 'daily' => 6250, 'total' => 156250],
        8 => ['name' => 'Stack 8', 'cost' => 30000, 'daily' => 7500, 'total' => 187500],
        9 => ['name' => 'Stack 9', 'cost' => 50000, 'daily' => 12500, 'total' => 312500],
        10 => ['name' => 'Stack 10', 'cost' => 70000, 'daily' => 17500, 'total' => 437500],
        11 => ['name' => 'Stack 11', 'cost' => 100000, 'daily' => 25000, 'total' => 625000],
        12 => ['name' => 'Stack 12', 'cost' => 150000, 'daily' => 37500, 'total' => 937500],
    ];

    public function stats(Request $request)
    {
        $user = $request->user();
        $totalEarnings = $user->transactions()
            ->where('type', 'credit')
            ->where('description', 'like', '%income%')
            ->sum('amount');
        $totalWithdrawn = $user->withdrawals()->where('status', 'approved')->sum('amount');
        $referralEarnings = $user->transactions()
            ->where('type', 'credit')
            ->where('description', 'like', '%referral%')
            ->sum('amount');

        return response()->json([
            'success' => true,
            'data' => [
                'total_earnings' => (float) $totalEarnings,
                'total_withdrawn' => (float) $totalWithdrawn,
                'total_referrals' => $user->referrals()->count(),
                'referral_earnings' => (float) $referralEarnings,
            ]
        ]);
    }

    public function invest(Request $request)
    {
        $request->validate(['tier' => 'required|integer|between:1,12']);
        $user = $request->user();
        $plan = self::PLANS[$request->tier];

        if ($user->wallet_balance < $plan['cost']) {
            return response()->json(['message' => 'Insufficient wallet balance'], 422);
        }

        $user->debit($plan['cost'], "Investment in {$plan['name']}");

        $investment = $user->investments()->create([
            'tier' => $request->tier,
            'plan_name' => $plan['name'],
            'amount' => $plan['cost'],  // ← this line was missing
            'daily_income' => $plan['daily'],
            'total_return' => $plan['total'],
            'status' => 'active',
            'started_at' => now(),
            'ends_at' => now()->addDays(25),
            'days_elapsed' => 0,
            'last_income_at' => null,
        ]);

        return response()->json(['success' => true, 'data' => $investment]);
    }

    public function investments(Request $request)
    {
        $q = $request->user()->investments()->latest();
        if ($request->status) {
            $q->where('status', $request->status);
        }
        return response()->json(['success' => true, 'data' => $q->paginate(10)]);
    }

    public function transactions(Request $request)
    {
        $q = $request->user()->transactions()->latest();
        if ($request->type) {
            $q->where('type', $request->type);
        }
        return response()->json(['success' => true, 'data' => $q->paginate(20)]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
        ]);
        $request->user()->update($request->only('name', 'phone'));
        return response()->json(['success' => true, 'message' => 'Profile updated']);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|confirmed|min:8',
        ]);
        $user = $request->user();
        if (!\Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }
        $user->update(['password' => $request->password]);
        return response()->json(['success' => true, 'message' => 'Password updated']);
    }

    public function referralStats(Request $request)
    {
        $user = $request->user();
        $signupBonuses = $user->transactions()
            ->where('description', 'like', '%Referral signup bonus%')->sum('amount');
        $commission = $user->transactions()
            ->where('description', 'like', '%Referral commission%')->sum('amount');
        return response()->json([
            'success' => true,
            'data' => [
                'total' => $user->referrals()->count(),
                'total_earnings' => (float) ($signupBonuses + $commission),
                'signup_bonuses' => (float) $signupBonuses,
                'commission' => (float) $commission,
            ]
        ]);
    }

    public function referrals(Request $request)
    {
        $refs = $request->user()->referrals()
            ->select('id', 'name', 'email', 'created_at')
            ->withSum(['investments as total_invested' => fn($q) => $q->where('status', 'active')], 'amount')
            ->paginate(20);
        return response()->json(['success' => true, 'data' => $refs]);
    }
}
