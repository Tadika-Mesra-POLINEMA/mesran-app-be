export interface RegisterUserRequest {
  email: string;
  phone: string;
  password: string;
  role: 'USER' | 'ADMIN';
}

export interface RegisterUserResponse {
  email: string;
}

interface EmailLogin {
  email: string;
  password: string;
}

interface PhoneLogin {
  phone: string;
  password: string;
}

export type LoginRequest = EmailLogin | PhoneLogin;

export interface LoginResponse {
  verificationKey: string;
  otp: string;
}

export interface OTP {
  userId: string;
  code: string;
}

export interface VerifyLoginRequest {
  verificationKey: string;
  otp: string;
}

export interface VerifyLoginResponse {
  email: string;
  accessToken: string;
  refreshToken: string;
}
