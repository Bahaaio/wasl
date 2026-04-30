import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../auth/store";
import api from "./client";

// add access token to the request header if it exists
api.interceptors.request.use(config => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// try to refresh the access token if the request fails with a 401 error
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // reject if not unauthorized error, or if the request has already been retried
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // mark the request as retried
    originalRequest._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const response = await api.post("/auth/refresh");
        const { access_token } = response.data;

        setAccessToken(access_token);

        // retry all queued requests
        processQueue(null, access_token);

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();
        // TODO: logout
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // queue the request when refreshing
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then(token => {
        // update token and retry
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      })
      .catch(err => Promise.reject(err));
  }
);
