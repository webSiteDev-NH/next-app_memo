<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;

use App\Http\Requests\LoginRequest;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * ログイン
     * @param LoginRequest $request
     * @return JsonResource
     */
    public function login(LoginRequest $request): JsonResource
    {
        if (Auth::attempt($request->all())) {
            $request->session()->regenerate();

            // ユーザー情報を渡す
            return new UserResource(Auth::user());
        }

        // バリデーション以外のエラー
        throw ValiationException::withMessage([
            'LoginFailed' => 'IDまたはpassword間違っています'
        ]);
    }
}
