import axiosLibrary from 'axios';

const AxiosInstance = axiosLibrary.create({
  baseURL: 'https://frontend-test-api.aircall.io',
});

export default AxiosInstance;
