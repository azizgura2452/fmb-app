import axios from 'axios';

export const BASE_DOMAIN = 'https://darkred-tapir-886515.hostingersite.com/';
export const API_URL = BASE_DOMAIN + 'admin/api/';


// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL, // Environment variable for base URL
  timeout: 30000, // Timeout after 10 seconds
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// Add interceptors if needed for request/response handling

export default axiosInstance;