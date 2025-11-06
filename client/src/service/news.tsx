import axios, { type AxiosRequestConfig } from "axios";

const ax_cfg: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE,
};

export const getPong = async () => {
  axios
    .get("/ping", ax_cfg)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error("can not connect to server", err);
    });
};
