export interface RegisterUserRequest {
  email: string;
  phone: string;
  password: string;
  role: 'USER' | 'ADMIN';
}

export interface RegisterUserResponse {
  email: string;
}

export interface UserProfile {
  username: string;
  firstname: string;
  lastname: string;
}

export interface UpdateUserRequest {
  phone: string;
}

export interface UpdateProfileUserRequest {
  username: string;
  firstname: string;
  lastname: string;
}
