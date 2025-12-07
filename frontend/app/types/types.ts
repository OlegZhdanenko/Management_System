export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  token?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
