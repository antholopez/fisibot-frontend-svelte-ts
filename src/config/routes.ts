import HomeSvelte from "./../pages/Home.svelte";
import { authStore } from "./../state/store";
import { wrap } from "svelte-spa-router/wrap";
import LoginSvelte from "./../pages/Login.svelte";

const validateSessionUser = () => {
  const user = authStore.getUserSession();
  return user ? true : false;
};

export const routes = {
  "/": HomeSvelte,
  "/login": wrap({
    component: LoginSvelte,
    conditions: [async () => !validateSessionUser()],
  }),
  // "/courses/:id": CourseId,
  // "/courses/:id/students": wrap({
  //   component: Student,
  //   conditions: [async () => validateSessionUser()],
  // }),
};
