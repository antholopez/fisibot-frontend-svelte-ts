import type { ISchool } from "./../interfaces/school.interface";
import { http } from "../config/axios";
import { schoolStore } from "./../state/store";

export const getSchools = async () => {
  let schools = schoolStore.get();

  if (!schools.length) {
    const { data } = await http.get<ISchool[]>("/schools");
    schoolStore.set(data);

    return data;
  }

  return schools;
};
