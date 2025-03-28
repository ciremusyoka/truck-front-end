import axios from 'axios';
import { API_URL } from './configs';
import Cookies from 'js-cookie';
import { COOKIE_NAME, LOGIN_LINK } from './constants';

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

let isRedirecting = false;

// Add response interceptor to handle 401 errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!isRedirecting) {
        isRedirecting = true;
        Cookies.remove(COOKIE_NAME);
        window.location.href = LOGIN_LINK;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;