import type { ICourse } from "./../interfaces/course.interface";
import type { ISession } from "./../interfaces/session.interface";
import { http } from "../config/axios";
import { courseStore } from "./../state/store";

export const createCourse = async (body: any): Promise<ICourse> => {
  const { data } = await http.post<ICourse>("/courses", body);
  console.log("createCourse: ", data);
  return data;
};

export const getCourses = async (): Promise<ICourse[]> => {
  let courses = courseStore.get();

  if (!courses.length) {
    const { data } = await http.get<ICourse[]>("/courses");
    courseStore.set(data);
    return data;
  }

  return courses;
};

export const getCourse = async (id: number): Promise<ICourse> => {
  return (await http.get<ICourse>(`/courses/${id}`)).data;
};

export const createSession = async (body: any): Promise<ISession> => {
  const { data } = await http.post<ISession>("/courses/sessions", body);
  console.log("createSession: ", data);
  return data;
}

export const getSessionsByCourse = async (id: number): Promise<ISession[]> => {
  return (await http.get<ISession[]>(`/courses/${id}/sessions`)).data;
}
