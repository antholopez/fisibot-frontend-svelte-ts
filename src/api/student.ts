import type { IStudent } from "./../interfaces/student.interface";
import { http } from "./../config/axios1";

export const createStudent = async (body: any): Promise<IStudent> => {
  const { data } = await http.post<IStudent>("/users/students", body);
  console.log("createStudent: ", data);
  return data;
};

export const getStudentsByCourse = async (id: number): Promise<IStudent[]> => {
  return (await http.get<IStudent[]>(`/users/students/courses/${id}`)).data;
};
