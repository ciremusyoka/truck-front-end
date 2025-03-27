import axios from 'axios';
import { API_URL } from './configs';
import Cookies from 'js-cookie';
import { COOKIE_NAME } from './constants';

export const getAuthToken = () => Cookies.get(COOKIE_NAME);

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;