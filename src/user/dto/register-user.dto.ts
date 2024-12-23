export class RegisterUserRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'USER' | 'ADMIN';
}

export class RegisterUserResponse {
  email: string;
  accessToken: string;
  refreshToken: string;
}
