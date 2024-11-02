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
    id: string;
    // email: string;
  };
}
