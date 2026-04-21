<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{User, Deposit, Withdrawal, Investment, Transaction, Setting};
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /* ── Stats ── */
    public function stats()
    {
        return response()->json(['success' => true, 'data' => [
            'total_users'         => User::where('role', 'user')->count(),
            'total_deposits'      => (float) Deposit::where('status', 'approved')->sum('amount'),
            'total_withdrawals'   => (float) Withdrawal::where('status', 'approved')->sum('amount'),
            'active_investments'  => Investment::where('status', 'active')->count(),
            'pending_deposits'    => Deposit::where('status', 'pending')->count(),
            'pending_withdrawals' => Withdrawal::where('status', 'pending')->count(),
        ]]);
    }

    /* ── Users ── */
    public function users(Request $request)
    {
        $q = User::where('role', 'user')->latest();
        if ($request->search) {
            $q->where(fn($sub) => $sub
                ->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%"));
        }
        return response()->json(['success' => true, 'data' => $q->paginate(20)]);
    }

    public function creditUser(Request $request, User $user)
    {
        $request->validate(['amount' => 'required|numeric|min:1']);
        $user->credit($request->amount, 'Admin credit');
        return response()->json(['success' => true, 'message' => 'Wallet credited']);
    }

    public function toggleUserStatus(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);
        return response()->json(['success' => true, 'data' => ['is_active' => $user->is_active]]);
    }

    /* ── Deposits ── */
    public function deposits(Request $request)
    {
        $q = Deposit::with('user')->latest();
        if ($request->status) $q->where('status', $request->status);
        return response()->json(['success' => true, 'data' => $q->paginate(20)]);
    }

    public function reviewDeposit(Request $request, Deposit $deposit)
    {
        $request->validate([
            'status'     => 'required|in:approved,rejected',
            'admin_note' => 'nullable|string|max:500',
        ]);

        if ($deposit->status !== 'pending') {
            return response()->json(['message' => 'Deposit already reviewed'], 422);
        }

        $deposit->update([
            'status'      => $request->status,
            'admin_note'  => $request->admin_note,
            'approved_at' => $request->status === 'approved' ? now() : null,
        ]);

        if ($request->status === 'approved') {
            $deposit->user->credit($deposit->amount, "Deposit approved — ₦{$deposit->amount}");
        }

        return response()->json(['success' => true, 'message' => "Deposit {$request->status}"]);
    }

    /* ── Withdrawals ── */
    public function withdrawals(Request $request)
    {
        $q = Withdrawal::with('user')->latest();
        if ($request->status) $q->where('status', $request->status);
        return response()->json(['success' => true, 'data' => $q->paginate(20)]);
    }

    public function reviewWithdrawal(Request $request, Withdrawal $withdrawal)
    {
        $request->validate([
            'status'     => 'required|in:approved,rejected',
            'admin_note' => 'nullable|string|max:500',
        ]);

        if ($withdrawal->status !== 'pending') {
            return response()->json(['message' => 'Withdrawal already reviewed'], 422);
        }

        $withdrawal->update([
            'status'       => $request->status,
            'admin_note'   => $request->admin_note,
            'processed_at' => now(),
        ]);

        // If rejected, refund the wallet (was debited on request)
        if ($request->status === 'rejected') {
            $withdrawal->user->credit($withdrawal->amount, "Withdrawal rejected — refund ₦{$withdrawal->amount}");
        }

        return response()->json(['success' => true, 'message' => "Withdrawal {$request->status}"]);
    }

    /* ── Investments ── */
    public function investments(Request $request)
    {
        $q = Investment::with('user')->latest();
        if ($request->status) $q->where('status', $request->status);
        return response()->json(['success' => true, 'data' => $q->paginate(20)]);
    }

    /* ── Transactions ── */
    public function transactions(Request $request)
    {
        $q = Transaction::with('user')->latest();
        return response()->json(['success' => true, 'data' => $q->paginate(30)]);
    }

    /* ── Settings ── */
    public function getSettings()
    {
        return response()->json(['success' => true, 'data' => [
            'bank_name'      => Setting::get('bank_name'),
            'account_name'   => Setting::get('account_name'),
            'account_number' => Setting::get('account_number'),
            'telegram_link'  => Setting::get('telegram_link'),
        ]]);
    }

    public function saveSettings(Request $request)
    {
        $request->validate([
            'bank_name'      => 'required|string|max:100',
            'account_name'   => 'required|string|max:100',
            'account_number' => 'required|string|max:20',
            'telegram_link'  => 'nullable|url',
        ]);

        foreach (['bank_name', 'account_name', 'account_number', 'telegram_link'] as $key) {
            Setting::set($key, $request->$key);
        }

        return response()->json(['success' => true, 'message' => 'Settings saved']);
    }
}
