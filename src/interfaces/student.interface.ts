export interface IStudent {
  id?: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  code: string | null;
  image: string | null;
  courseId?: number | null;
}