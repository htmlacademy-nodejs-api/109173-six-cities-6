import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { Token } from './utils';
import { ValidationErrorField } from './adapters/types/validation-error-field.type';

const BACKEND_URL = 'http://localhost:8000';
const REQUEST_TIMEOUT = 5000;

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = Token.get();

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      toast.dismiss();

      if(error?.response && error.response.data?.details) {
        error.response.data.details.map((errorItem: ValidationErrorField) => {
          const messages = errorItem.messages.join(' | ');
          toast.warn(messages);
        });
      } else {
        toast.warn(error.response ? error.response.data.error : error.message);
      }

      return Promise.reject(error);
    }
  );

  return api;
};
