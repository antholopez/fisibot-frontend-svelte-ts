export interface IAuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  code: string;
  accessToken?: string;
}

export interface IUserLogin {
  emailOrCode: string;
  password: string;
}
