export interface VerifyLoginRequest {
  verificationKey: string;
  otp: string;
}

export interface VerifyLoginResponse {
  email: string;
  accessToken: string;
  refreshToken: string;
}
