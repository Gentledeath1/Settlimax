<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DepositController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->user()->deposits()->latest()->paginate(15);
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:100',
            'proof'  => 'required|image|max:5120',
        ]);

        $path = $request->file('proof')->store('deposits/proofs', 'public');

        $deposit = $request->user()->deposits()->create([
            'amount'    => $request->amount,
            'proof_url' => $path,
            'status'    => 'pending',
        ]);

        return response()->json(['success' => true, 'data' => $deposit], 201);
    }
}
