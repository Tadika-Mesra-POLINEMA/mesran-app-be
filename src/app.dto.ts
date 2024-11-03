import { Request } from 'express';

export type WebResponse<T> = {
  status: 'success' | 'fail' | 'error';
  message: string;
  data?: T;
  errors?: Errors;
};

export type Errors = {
  [key: string]: string[];
};

export interface AuthenticatedRequest extends Request {
  user?: {
    role: Role;
    id: string;
  };
}

export class Role {
  static ADMIN = 'ADMIN';
  static USER = 'USER';
}
