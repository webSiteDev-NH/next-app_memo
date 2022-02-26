import type { NextPage } from 'next';
import { RequiredMark } from '../components/RequiredMark';
import { axiosApi } from '../lib/axios';
import { useState, ChangeEvent } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';

// ログインユーザーの型
type LoginForm = {
  email: string;
  password: string;
}

// testUser
// test@example.com
// password

// バリデーションメッセージの型
type Validation = {
  email?: string;
  password?: string;
  loginFailed?: string;
};

const Home: NextPage = () => {
  const router = useRouter();

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: ''
  })

  // バリデーションメッセージのstate
  const [validation, setValidation] = useState<Validation>({});

  // ログインフォームの入力値取得
  const updateLoginForm = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const login = () => {
    // バリデーションメッセージの初期化
    // loginの度にバリデーション表示を更新
    setValidation({});

    axiosApi
      // CSRF保護の初期化
      .get('/sanctum/csrf-cookie')
      .then((res) => {
        // ログイン処理
        axiosApi
          .post('/login', loginForm)
          .then((response: AxiosResponse) => {
            console.log(response.data);
            router.push('/memos');
          })
          .catch((err: AxiosError) => {
            // status確認
            console.log(err.response?.status);
            // errorsオブジェクト確認
            console.log(err.response?.data.errors);
            // バリデーションエラー
            if (err.response?.status === 422) {
              const errors = err.response?.data.errors;
              // state更新用のオブジェクトを別で定義
              // { [key: string] : value: string }
              const validationMessages: { [index: string]: string } = {} as Validation;;
              Object.keys(errors).map((key: string) => {
                // errors[key][0] = エラーメッセージ
                validationMessages[key] = errors[key][0];
              });
              // state更新用オブジェクトに更新
              // typeのkeyとerrorsオブジェクトのkeyは合わせておく
              // スプレッド構文の場合、エラーメッセージが残る
              // setValidation({ ...validation, ...validationMessages });
              setValidation(validationMessages);
            }
            if (err.response?.status === 500) {
              alert('システムエラーです！！');
            }
          });
      });
  };

  // 入力フォーム内の値確認 onChange
  // console.log(loginForm);

  return (
    <div className='w-2/3 mx-auto py-24'>
      <div className='w-1/2 mx-auto border-2 px-12 py-16 rounded-2xl'>
        <h3 className='mb-10 text-2xl text-center'>ログイン</h3>
        <div className='mb-5'>
          <div className='flex justify-start my-2'>
            <p>メールアドレス</p>
            <RequiredMark />
          </div>
          <input
            className='p-2 border rounded-md w-full outline-none'
            name='email'
            value={loginForm.email}
            onChange={updateLoginForm}
          />
         {validation.email && (
            <p className='py-3 text-red-500'>{validation.email}</p>
         )}
        </div>
        <div className='mb-5'>
          <div className='flex justify-start my-2'>
            <p>パスワード</p>
            <RequiredMark />
          </div>
          <small className='mb-2 text-gray-500 block'>
            8文字以上の半角英数字で入力してください
          </small>
          <input
            className='p-2 border rounded-md w-full outline-none'
            name='password'
            type='password'
            value={loginForm.password}
            onChange={updateLoginForm}
          />
          {validation.password && (
            <p className='py-3 text-red-500'>{validation.password}</p>
          )}
        </div>
        <div className='text-center mt-12'>
          {validation.loginFailed && (
            <p className='py-3 text-red-500'>{validation.loginFailed}</p>
          )}
          <button
            className='bg-gray-700 text-gray-50 py-3 sm:px-20 px-10 rounded-xl cursor-pointer drop-shadow-md hover:bg-gray-600' onClick={login}
          >
            ログイン
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
