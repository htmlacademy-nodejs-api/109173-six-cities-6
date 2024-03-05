export const AppError = {
  VALIDATION_ERROR: 'ValidationError',
  AUTHENTICATION_ERROR: 'AuthenticationError',
  COMMON_ERROR: 'CommonError',
  SERVICE_ERROR: 'ServiceError',
} as const;

type AppErrorTypeKeys = keyof typeof AppError
export type AppErrorType = (typeof AppError)[AppErrorTypeKeys];
