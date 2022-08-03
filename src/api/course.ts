import type { ICourse } from "./../interfaces/course.interface";
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
