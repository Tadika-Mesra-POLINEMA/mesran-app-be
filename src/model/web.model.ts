export type WebResponse<T> = {
  status: 'success' | 'fail' | 'error';
  message: string;
  data?: T;
  errors?: Errors;
};

export type Errors = {
  [key: string]: string[];
};
