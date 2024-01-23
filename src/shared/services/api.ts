import axios from 'axios';

export const ServiceURL = {
  BASE: 'http://localhost:3000',
  API: '/api',
} as const;

const TIMEOUT = 5000;

export function createAPI() {
  const api = axios.create({
    baseURL: ServiceURL.BASE,
    timeout: TIMEOUT,
  });

  return api;
}
