import type { ICourse } from "./../interfaces/course.interface";
import { writable, get } from "svelte/store";
import type { ISchool } from "./../interfaces/school.interface";
import type { IAuthUser } from "./../interfaces/auth.interface";
import { getCourses } from "./../api/course";

const createAuth = () => {
  let persistedUser = localStorage.getItem("userStorage");
  const auth = writable<IAuthUser>(
    persistedUser ? JSON.parse(persistedUser) : null
  );
  const { subscribe, update } = auth;

  return {
    subscribe,
    getUserSession: () => get(auth),
    setUserSession: (data: IAuthUser) => {
      if (data) {
        localStorage.setItem("userStorage", JSON.stringify(data));
        update(() => data);
      } else {
        localStorage.removeItem("userStorage");
        update(() => null);
      }
    },
  };
};

const createSchool = () => {
  const schools = writable<ISchool[]>([]);
  const { subscribe, update } = schools;
  return {
    subscribe,
    set: (data: ISchool[]) => update(() => data),
    get: () => get(schools),
  };
};

const createCourse = () => {
  const courses = writable<ICourse[]>([]);
  const { subscribe, update } = courses;
  return {
    subscribe,
    set: (data: ICourse[]) => update(() => data),
    get: () => get(courses),
    getOneCourse: async (id: number) =>
      get(courses).find((course) => course.id === id) ||
      (await getCourses()).find((course) => course.id === id),
  };
};

const createAcademicSemester = () => {
  const academicSemesters = writable([{ name: "2022-1" }, { name: "2022-2" }]);
  const { subscribe, update } = academicSemesters;
  return {
    subscribe,
    set: (data: { name: string }[]) => update(() => data),
    get: () => get(academicSemesters),
  };
};

const createCycle = () => {
  const cycles = writable([
    { name: "I" },
    { name: "II" },
    { name: "III" },
    { name: "IV" },
    { name: "V" },
    { name: "VI" },
    { name: "VII" },
    { name: "VIII" },
    { name: "IX" },
    { name: "X" },
  ]);
  const { subscribe, update } = cycles;
  return {
    subscribe,
    set: (data: { name: string }[]) => update(() => data),
    get: () => get(cycles),
  };
};

const createGroup = () => {
  const groups = writable([
    { id: 1, name: 1 },
    { id: 2, name: 2 },
  ]);
  const { subscribe, update } = groups;
  return {
    subscribe,
    set: (data: { id: number; name: number }[]) => update(() => data),
    get: () => get(groups),
  };
};

export const schoolStore = createSchool();
export const courseStore = createCourse();
export const authStore = createAuth();
export const academicSemesterStore = createAcademicSemester();
export const cycleStore = createCycle();
export const groupStore = createGroup();
