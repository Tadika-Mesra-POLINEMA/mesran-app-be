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
