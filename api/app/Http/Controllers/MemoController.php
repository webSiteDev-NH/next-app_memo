<?php

namespace App\Http\Controllers;

use App\Http\Requests\MemoPostRequest;
use App\Models\Memo;
use Exception;
use App\Http\Resources\MemoResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class MemoController extends Controller
{
    /**
     * メモの全件取得
     * @return AnonymousResourceCollection
     */
    public function fetch(): AnonymousResourceCollection
    {
        // ログインユーザーのID取得
        $id = Auth::id();
        // ログイン確認
        if (!$id) {
            throw new Exception('未ログインです。');
        }

        try {
            // 日付の降順
            $memos = Memo::where('user_id', $id)->latest()->get();
        } catch (Exception $e) {
            throw $e;
        }

        // Memoインスタンスの配列を返す
        return MemoResource::collection($memos);
    }

    /**
     * メモの登録
     * @param MemoPostRequest $request
     * @return JsonResponse
     */
    public function create(MemoPostRequest $request): JsonResponse
    {
        try {
            // モデルクラスのインスタンス化
            $memo = new Memo();
            // パラメータのセット
            $memo->user_id = Auth::id();
            $memo->title = $request->title;
            $memo->body = $request->body;
            // モデルの保存
            $memo->save();

        } catch (Exception $e) {
            throw $e;
        }

        return response()->json([
            'message' => 'メモの登録に成功しました。'
        ], 201);
    }
}
