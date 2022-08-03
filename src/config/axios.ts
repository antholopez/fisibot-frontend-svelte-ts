import axios, { type AxiosResponse } from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { notify } from "../utils/notification";
import { push } from "svelte-spa-router";

const { VITE_API_BASE_URL } = import.meta.env;

enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
}

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf-8",
};

const injectToken = (config: AxiosRequestConfig): AxiosRequestConfig => {
  try {
    const token = Cookies.get("jwt");

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  } catch (error) {
    throw new Error(error);
  }
};

class Http {
  private instance: AxiosInstance | null = null;

  private get http(): AxiosInstance {
    return this.instance != null ? this.instance : this.initHttp();
  }

  initHttp() {
    const newHttp = axios.create({
      baseURL: VITE_API_BASE_URL,
      timeout: 60000,
      headers,
    });

    newHttp.interceptors.request.use(injectToken, (error) =>
      Promise.reject(error)
    );

    newHttp.interceptors.response.use(
      (response) => response,
      (error) => {
        const url = error.config.url;
        const { response } = error;
        return this.handleError(response, url);
      }
    );

    this.instance = newHttp;
    return newHttp;
  }

  request<T = any, R = AxiosResponse<T>>(
    config: AxiosRequestConfig
  ): Promise<R> {
    return this.http.request(config);
  }

  async get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.get<T, R>(url, config);
  }

  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.post<T, R>(url, data, config);
  }

  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.put<T, R>(url, data, config);
  }

  delete<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.delete<T, R>(url, config);
  }

  private async handleError(error: { status: any }, url: any) {
    const { status } = error;

    switch (status) {
      case StatusCode.InternalServerError: {
        notify("error", "Error de conexión", "Por favor intentelo mas tarde");
        break;
      }
      case StatusCode.Forbidden: {
        // Handle Forbidden
        break;
      }
      case StatusCode.Unauthorized: {
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
        break;
      }
      case StatusCode.TooManyRequests: {
        break;
      }
    }

    return Promise.reject(error);
  }
}

export const http = new Http();
