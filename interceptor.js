import axios from 'axios';
import { toast } from "react-hot-toast";
import storageService from './storageService';

const baseURL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL
});

instance.interceptors.request.use(
  (config) => {
    if (config.headers['Content-Type']) {
      return config;
    }
    config.headers['Content-Type'] = 'application/json';
    const token = storageService.getToken();
    if (token) {
      config.headers['Tangy-token'] = `${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      toast("Unauthorized access")
    }
    return Promise.reject(error);
  }
);

export default instance;