export interface LoginFormData {
  username: string;
  password: string;
}

export interface LoginResponse {
  success?: boolean;
  error?: string;
  redirect?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_authenticated: boolean;
}
