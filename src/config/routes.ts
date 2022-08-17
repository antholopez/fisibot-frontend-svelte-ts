import HomeSvelte from "./../pages/Home.svelte";
import { authStore } from "./../state/store";
import { wrap } from "svelte-spa-router/wrap";
import LoginSvelte from "./../pages/Login.svelte";
import CourseSvelte from "./../pages/courses/Course.svelte";
import StudentSvelte from "./../pages/students/Student.svelte";
import SessionsSvelte from "./../pages/sessions/Sessions.svelte";
import SessionSvelte from "./../pages/sessions/Session.svelte";
import TopicSvelte from "./../pages/topics/Topic.svelte";

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
  "/courses/:id": CourseSvelte,
  "/courses/:id/students": wrap({
    component: StudentSvelte,
    conditions: [async () => validateSessionUser()],
  }),
  "/courses/:id/sessions": wrap({
    component: SessionsSvelte,
    conditions: [async () => validateSessionUser()],
  }),
  "/courses/:id/sessions/:id2": wrap({
    component: SessionSvelte,
    conditions: [async () => validateSessionUser()],
  }),
  "/courses/:id/sessions/:id2/topics/:id3": wrap({
    component: TopicSvelte,
    conditions: [async () => validateSessionUser()],
  }),
};
