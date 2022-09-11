const axios = require('axios');

// Create a new Axios instance with a custom config.
// The timeout is set to 10s. If the request takes longer than
// that then the request will be aborted.
const axiosInstance = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

// console.log('axiosInstance url: ', axiosInstance.defaults.baseURL);

axiosInstance.interceptors.request.use(
  function (config) {
    // do smth before request is sent
    // if (session) {
    //     config.headers['Authorization'] = `Bearer ${token}`
    // }
    return config;
  },
  function (error) {
    // do smth with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    // do ssmth with response data
    return response;
  },
  function (error) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          console.log('status code 404: not found');
          break;
        case 500:
          console.log('status code 500: server error');
          break;
        default:
          console.log(error.message);
      }
    }
    // TODO: FIXME: 需要處理window.navigator.online沒有連線的狀況，但應該在這個專案裡面是在前端要處理？
    // src: https://ithelp.ithome.com.tw/articles/10230336
    return Promise.reject(error);
  }
);

// const getAPI = async (url, params) => {
//   try {
//     const res = await axiosInstance.get(url, {
//       params,
//     });
//     return res.data;
//   } catch (response) {
//     return Promise.reject(response.data);
//   }
// };

// const postAPI = async (url, data) => {
//   try {
//     const res = await axiosInstance.post(url, {
//       data,
//     });
//     return res.data;
//   } catch (response) {
//     return Promise.reject(response.data);
//   }
// };

// module.exports = { axiosInstance, getAPI };

module.exports = function (method, url, data, config) {
  method = method.toLowerCase();
  switch (method) {
    case 'post':
      return axiosInstance.post(url, data, config);
    case 'get':
      return axiosInstance.get(url, { params: data });
    case 'delete':
      return axiosInstance.delete(url, { params: data });
    case 'put':
      return axiosInstance.put(url, data);
    case 'patch':
      return axiosInstance.patch(url, data);
    default:
      console.log(`unknown http method: ${method}`);
      return false;
  }
};

// module.exports = { httpRequest };
