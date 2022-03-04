import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { axiosApi } from '../../lib/axios';
import { useUserState } from '../../atoms/userAtom';

type Memo = {
  title: string;
  body: string;
};

const Memo: NextPage = () => {
  const router = useRouter();

  // useRecoilState の user変数を取得
  const { user } = useUserState();
  // ログインユーザー確認
  console.log(user);

  const [memos, setMemos] = useState<Memo[]>([]);

  // 初回レンダリング時 → メモ一覧取得
  useEffect(() => {
    // ログインチェック
    if (!user) {
      router.push({
        pathname: '/',
        query: {alert : 'ログインしてください'}
      });
      return;
    }

    axiosApi
      .get('/api/memos')
      .then((response: AxiosResponse) => {
        console.log(response.data)
        setMemos(response.data.data);
      })
      .catch((err: AxiosError) => console.log(err.response));
  }, [user, router]);

  return (
    <div className='w-2/3 mx-auto mt-32'>
      <h1 className='bg-emerald-200 mb-12 text-center'>{router.query.success}</h1>
      <div className='w-1/2 mx-auto text-center'>
        <button
          className='text-xl mb-12 py-3 px-10 bg-blue-500 text-white rounded-3xl drop-shadow-md hover:bg-blue-400'
          onClick={() => router.push('/memos/post')}
        >
          メモを追加する
        </button>
      </div>
      <div className='mt-3'>
        {/* 仮データでの一覧表示 */}
        <div className='grid w-2/3 mx-auto gap-4 grid-cols-2'>
          {memos.map((memo: Memo, index) => {
            return (
              <div className='bg-gray-100 shadow-lg mb-5 p-4' key={index}>
                <p className='text-lg font-bold mb-1'>{memo.title}</p>
                <p className=''>{memo.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Memo;
