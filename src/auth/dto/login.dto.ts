export class EmailLogin {
  email: string;
  password: string;
}

export class PhoneLogin {
  phone: string;
  password: string;
}

export class LoginResponse {
  verificationKey: string;
}
