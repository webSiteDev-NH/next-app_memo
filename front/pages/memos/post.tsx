import type { NextPage } from 'next';
import { RequiredMark } from '../../components/RequiredMark';
import { useState, useEffect } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { axiosApi } from '../../lib/axios';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

// POSTデータの型
type MemoForm = {
  title: string;
  body: string;
};

// バリデーションメッセージの型
type Validation = {
  title?: string;
  body?: string;
};

const Post: NextPage = () => {
  const router = useRouter();

  const {
    register,              // 入力データ保持
    handleSubmit,          // 送信メソッド
    formState: { errors }, // errorオブジェクト
  } = useForm<MemoForm>(); // 入力値の型

  console.log(errors);

  const [validation, setValidation] = useState<Validation>({});

  const { checkLoggedIn } = useAuth();

  // useEffect自体をasyncにはできない
  useEffect(() => {
    // ログイン中か判定
    const init = async () => {
      // ログイン中か判定
      const res: boolean = await checkLoggedIn();
      if (!res) {
        router.push({
          pathname: '/',
          query: {alert : 'ログインしてください'}
        });
      }
    };
    init();
  }, []);

   // メモの登録
   const createMemo = (data: MemoForm) => {
     // バリデーションメッセージの初期化
    setValidation({});

    axiosApi
      // CSRF保護の初期化
      .get('/sanctum/csrf-cookie')
      .then((res) => {
        // APIへのリクエスト
        axiosApi
        .post('/api/memos', data)
          .then((response: AxiosResponse) => {
            console.log(response.data);
            // 登録成功時：メモ一覧遷移
            // notice追加
            router.push(
              {
                pathname:"/memos",                //URL
                query: {success : '登録できました'} //成功メッセージ
              }
            )
          })
          .catch((err: AxiosError) => {
            console.log(err.response);
            // バリデーションエラー
            if (err.response?.status === 422) {
              const errors = err.response?.data.errors;
              // state更新用のオブジェクトを別で定義
              const validationMessages: { [index: string]: string } = {} as Validation;
              Object.keys(errors).map((key: string) => {
                validationMessages[key] = errors[key][0];
              });
              // state更新用オブジェクトに更新
              setValidation(validationMessages);
            }
            if (err.response?.status === 500) {
              alert('システムエラーです！！');
            }
          });
      });
  };

  return (
    <div className='w-2/3 mx-auto'>
      <div className='w-1/2 mx-auto mt-32 border-2 px-12 py-16 rounded-2xl'>
        <h3 className='mb-10 text-2xl text-center'>メモの登録</h3>
        <div className='mb-5'>
          <div className='flex justify-start my-2'>
            <p>タイトル</p>
            <RequiredMark />
          </div>
          <input
            className='p-2 border rounded-md w-full outline-none'
            {...register('title', { required: '必須入力です。' })}
          />
          <ErrorMessage
            errors={errors}
            name={'title'}
            render={({ message }) => (
              <p className='py-3 text-red-500'>{message}</p>
            )}
          />
          {validation.title && (
            <p className='py-3 text-red-500'>{validation.title}</p>
          )}
        </div>
        <div className='mb-5'>
          <div className='flex justify-start my-2'>
            <p>メモの内容</p>
            <RequiredMark />
          </div>
          <textarea
            className='p-2 border rounded-md w-full outline-none'
            cols={30}
            rows={4}
            {...register('body', { required: '必須入力です。' })}
          />
          <ErrorMessage
            errors={errors}
            name={'body'}
            render={({ message }) => (
              <p className='py-3 text-red-500'>{message}</p>
            )}
          />
          {validation.body && (
            <p className='py-3 text-red-500'>{validation.body}</p>
          )}
        </div>
        <div className='text-center'>
          <button
            className='bg-gray-700 text-gray-50 py-3 sm:px-20 px-10 mt-8 rounded-xl cursor-pointer drop-shadow-md hover:bg-gray-600'
            onClick={handleSubmit(createMemo)}
          >
            登録する
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
