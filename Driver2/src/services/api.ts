import axios from 'axios';
import { Platform } from 'react-native';

let baseURL = process.env.EXPO_PUBLIC_API_URL as string | undefined;
if (!baseURL) {
  baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://127.0.0.1:4000';
}

const api = axios.create({ baseURL });

let token: string | null = null;

export function setApiToken(t: string | null) {
  token = t;
}

api.interceptors.request.use((config) => {
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
