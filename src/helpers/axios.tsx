import axiosLibrary from 'axios';

const AxiosInstance = axiosLibrary.create({
  baseURL: 'https://frontend-test-api.aircall.io',
});

// Add a request interceptor to add the auth token to every request
// AxiosInstance.interceptors.request.use(
//   (config) => {
//     return config;
//   },
//   (error) => {
//     Promise.reject(error);
//   },
// );

// Add a response interceptor to generate new auth token if the current expired and the request failed
AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    const statusCode = error.response.status || error.statusCode;
    if (statusCode === 401 && !originalRequest._retry) {
      // This is to avoid an infinite loop
      originalRequest._retry = true;
      return AxiosInstance.post(`/auth/login`, {
        username: 'String!',
        password: 'String!',
      }).then((res) => {
        if (res.status === 201) {
          // Add new auth token to original request 'Authorization' header
          originalRequest.headers['Authorization'] =
            'Bearer ' + res.data.access_token;

          // Rerun the original axios Request with the new Auth Header
          return AxiosInstance(originalRequest);
        }
      });
    }
  },
);

export default AxiosInstance;
