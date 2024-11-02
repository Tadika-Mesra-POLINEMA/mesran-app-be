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

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}
