export class VerifyLoginRequest {
  verificationKey: string;
  otp: string;
}

export class VerifyLoginResponse {
  email: string;
  accessToken: string;
  refreshToken: string;
}
