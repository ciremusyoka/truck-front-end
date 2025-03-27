import axios from 'axios';
import { API_URL } from './configs';

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer khqrx2LCjRSNmMkp8LgebznVTBi819'
  },
});



export default axiosClient;