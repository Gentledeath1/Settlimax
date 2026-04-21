<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'password' => ['required', 'confirmed', Password::min(8)],
            'referral_code' => 'nullable|string|exists:users,referral_code',
        ]);

        $referrer = null;
        if ($request->referral_code) {
            $referrer = User::where('referral_code', $request->referral_code)->first();
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => $request->password,
            'role' => 'user',
            'referral_code' => strtoupper(Str::random(8)),
            'referred_by' => $referrer?->id,
            'wallet_balance' => 0,
            'is_active' => true,
        ]);

        // Welcome bonus
        $welcomeBonus = (float) Setting::get('welcome_bonus', 800);
        $user->credit($welcomeBonus, 'Welcome bonus');

        // Referral signup bonus
        if ($referrer) {
            $signupBonus = (float) Setting::get('referral_signup_bonus', 20);
            $referrer->credit($signupBonus, "Referral signup bonus from {$user->name}");
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => ['token' => $token, 'user' => $this->userResource($user)],
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Your account has been deactivated. Contact support.'], 403);
        }

        // Daily login bonus
        $today = now()->toDateString();
        if ($user->last_login_at?->toDateString() !== $today) {
            $dailyBonus = (float) Setting::get('daily_login_bonus', 50);
            $user->credit($dailyBonus, 'Daily login bonus');
        }

        $user->update(['last_login_at' => now()]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => ['token' => $token, 'user' => $this->userResource($user)],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true, 'message' => 'Logged out']);
    }

    public function me(Request $request)
    {
        return response()->json(['success' => true, 'data' => $this->userResource($request->user())]);
    }

    private function userResource(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
            'wallet_balance' => (float) $user->wallet_balance,
            'referral_code' => $user->referral_code,
            'is_active' => $user->is_active,
            'created_at' => $user->created_at,
        ];
    }
}
