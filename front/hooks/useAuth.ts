import { useUserState } from '../atoms/userAtom';
import { axiosApi } from '../lib/axios';

export const useAuth = () => {
  const { user, setUser } = useUserState();

  // ログインチェック
  const checkLoggedIn = async (): Promise<boolean> => {
    // フロント：ログインユーザー情報チェック
    if (user) {
      return true;
    }

    try {
      // バックエンド：ログインチェック
      const res = await axiosApi.get('/api/user');
      console.log(res);
      // 未ログイン
      if (!res.data.data) {
        return false;
      }
      // ログイン済
      setUser(res.data.data);
      return true;
    } catch {
      // システムエラー
      return false;
    }
  };

  return { checkLoggedIn };
};
