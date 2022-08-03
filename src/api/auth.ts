import { http } from "../config/axios";

import Cookies from "js-cookie";
import type { IAuthUser } from "./../interfaces/auth.interface";

export const login = async (dataUser: any) => {
  const { data } = await http.post<IAuthUser>("/authentication/login", dataUser);
  console.log("user data", data);
  Cookies.set("jwt", data.accessToken);
  return data;
};

export const logout = async () => {
  const user = await http.post("/authentication/logout", {});
  console.log("user logout: ", user);
  Cookies.remove("jwt");
};
