import { ValidationError } from 'class-validator';
import { ValidationErrorField } from '../shared/types/validation-error-field.type.js';
import { AppErrorType } from '../shared/types/app-error.enum.js';

export function getPrettyErrors(errors: ValidationError[]): ValidationErrorField[] {
  const prettifiedErrors = errors?.map(({ property, value, constraints, children }) => {
    const messages = constraints ? Object.values(constraints) : [];

    // Обрабатываем вложенные ошибки
    if(children && children?.length > 0) {
      const errorsChildren = getPrettyErrors(children);

      errorsChildren.forEach((errorChild) => messages.push(...errorChild.messages));
    }

    const error = { property, value, messages };

    return error;
  });

  return prettifiedErrors;
}

export function createErrorObject(errorType: AppErrorType, error: string, details: ValidationErrorField[] = []) {
  return {errorType, error, details};
}
