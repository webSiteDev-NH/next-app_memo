import axios from 'axios';

// ベースURL定義
export const axiosApi = axios.create({
  baseURL: 'http://localhost:80',
  withCredentials: true,
});
