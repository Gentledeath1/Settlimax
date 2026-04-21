<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WithdrawalController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->user()->withdrawals()->latest()->paginate(15);
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount'         => 'required|numeric|min:800',
            'bank_name'      => 'required|string|max:100',
            'account_name'   => 'required|string|max:100',
            'account_number' => 'required|string|max:20',
        ]);

        $user = $request->user();

        if ($user->wallet_balance < $request->amount) {
            return response()->json(['message' => 'Insufficient wallet balance'], 422);
        }

        // Debit wallet immediately to hold funds
        $user->debit($request->amount, "Withdrawal request of ₦{$request->amount}");

        $withdrawal = $user->withdrawals()->create([
            'amount'         => $request->amount,
            'bank_name'      => $request->bank_name,
            'account_name'   => $request->account_name,
            'account_number' => $request->account_number,
            'status'         => 'pending',
        ]);

        return response()->json(['success' => true, 'data' => $withdrawal], 201);
    }
}
