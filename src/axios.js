import axios from 'axios';
import * as localstorageUtil from './utils/localstorage';

const result = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});
result.interceptors.request.use(
  function(config) {
    // const token = localstorageUtil.getItem('token');
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InBodTEyMyIsInJvbGVzIjpbInVzZXIiLCJlZGl0b3IiXSwiaWF0IjoxNjI5NDQyMzQ0LCJleHAiOjE2Mjk0NDI5NDR9.m817BNAl0kx4M0sMErk-k-AME-KZT6qmltMGMk2E7ZY";
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    config.baseURL = `http://localhost:9090`;
    return config;
  },
  function(error) {
    return Promise.reject(error);
  },
);

result.interceptors.response.use(
  function(response) {
    return response.data;
  },
  function(error) {
    const { response } = error;
    if (response) {
      const { status, data } = response;
      if (status === 401 && data && data.message == 'PROXY_UNAUTHORIZED') {
        localstorageUtil.clear();
        window.location.href = 'login';
      }
      if (status === 401 && data && data.message === `SERVICE_UNAUTHORIZED`) {
        window.EventBus.$emit('show-reconfigure-services', { "Service": false });
      }
      if (status === 403) {
        window.location.href = '/exception-403';
      }
      return Promise.reject(data);
    }
    return Promise.reject(error);
  },
);

export default result;
