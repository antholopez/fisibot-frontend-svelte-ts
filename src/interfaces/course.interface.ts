export interface ICourse {
  id?: number | null;
  name: string | null;
  description: string | null;
  image: string | null;
  academicSemester: string | null;
  cycle: string | null;
  group: number | string | null;
  idSchool: number | string | null;
  school?: {
    name: string;
  };
}
