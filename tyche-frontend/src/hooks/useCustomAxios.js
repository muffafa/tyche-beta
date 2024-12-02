import axios from "axios";

const useCustomAxios = () => {
  const instance = axios.create({
    baseURL: "/backend",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': '',
      }
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // unauthorized sorunları için
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default useCustomAxios;
