import type { ICourse } from "./../interfaces/course.interface";
import type { ISession } from "./../interfaces/session.interface";
import type { ITopic } from "./../interfaces/topic.interface";
import type { IQuestionAnswer, IQuestionAnswerList } from "./../interfaces/questionAnswer.interface";
import { http } from "../config/axios";
import { courseStore } from "./../state/store";

export const createCourse = async (body: any): Promise<ICourse> => {
  const { data } = await http.post<ICourse>("/courses", body);
  courseStore.addCourse(data);
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

export const createTopic = async (body: any): Promise<ITopic> => {
  const { data } = await http.post<any>("/courses/sessions/topics", body);
  console.log("createTopic: ", data);
  return data;
}

export const getTopicsBySession = async (id: number, id2: number): Promise<ITopic[]> => {
  return (await http.get<ITopic[]>(`/courses/${id}/sessions/${id2}/topics`)).data;
}

export const createQuestion = async (body: any): Promise<IQuestionAnswerList> => {
  const { data } = await http.post<any>("/courses/sessions/topics/questions", body);
  console.log("createQuestion: ", data);
  return data;
}

export const getQuestionsByTopic = async (id3: number): Promise<IQuestionAnswerList[]> => {
  return (await http.get<IQuestionAnswerList[]>(`/courses/sessions/topics/${id3}/questions`)).data;
}
