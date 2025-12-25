export type ApiResponse<T> =
  | {
      data?: T;
      message?: string;
      status?: number;
    }
  | {
      errors?: Record<string, string[]>;
      message?: string;
      status?: number;
    };
export type ApiResponseSuccess<T> = {
  data?: T;
  message?: string;
  status?: number;
};

export type ApiResponseError = {
  errors?: Record<string, string[]>;
  message?: string;
  status?: number;
  suppressToast?: boolean;
};
