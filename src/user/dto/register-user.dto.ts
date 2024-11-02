export interface RegisterUserRequest {
  email: string;
  phone: string;
  password: string;
  role: 'USER' | 'ADMIN';
}

export interface RegisterUserResponse {
  email: string;
}
