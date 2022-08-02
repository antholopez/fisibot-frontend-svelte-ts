import axios from "axios";
import Cookies from "js-cookie";
import { push } from "svelte-spa-router";
import { notify } from "./../utils/notification";

const { VITE_API_BASE_URL } = import.meta.env;

const instance = axios.create({
  baseURL: VITE_API_BASE_URL,
  timeout: 60000,
});

instance.interceptors.request.use((config) => {
  console.log("axios request: ", config);

  const bearerToken = Cookies.get("jwt");
  if (bearerToken) config.headers.Authorization = `Bearer ${bearerToken}`;

  return config;
});

instance.interceptors.response.use(
  (config) => {
    console.log("axios response ok: ", config);
    return config;
  },
  async (error) => {
    const { response } = error;
    const { status, statusText } = response;
    console.log("status: ", status);
    console.log("statusText: ", statusText);
    if (status === 401 && statusText === "Unauthorized") {
      try {
        console.log("axios response 401: ", response);
        const url = error.config.url;
        localStorage.removeItem("userStorage");
        Cookies.remove("jwt");
        await push("/login");
        if (url === "/authentication/login")
          notify(
            "error",
            "Credenciales inválidas",
            "Por favor verifique sus credenciales"
          );
        else
          notify(
            "error",
            "Sesión expirada",
            "Por favor inicia sesión nuevamente"
          );
      } catch (err) {
        console.log("axios response: ", err);
      }
    } else {
      notify("error", "Error de conexión", "Por favor intentelo mas tarde");
    }
  }
);

export const get = async (url: string): Promise<any> => {
  const { data } = await instance.get(url);
  return data;
};

export const post = async (url: string, body: any): Promise<any> => {
  const { data } = await instance.post(url, body);
  return data;
};

export const patch = async (url: string, body: any): Promise<any> => {
  const { data } = await instance.patch(url, body);
  return data;
};
export const del = (url: string) => instance.delete(url);
export const setBearerToken = (token: any) => {
  console.log("setBearerToken: ", token);
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};
