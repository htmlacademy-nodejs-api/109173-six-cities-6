import { ValidationError } from 'class-validator';

export function getPrettyErrors(errors: ValidationError[]) {
  const prettifiedMessages = errors?.map((error) => ({
    property: error.property,
    received: error.value,
    expected: error.constraints
  }));

  return prettifiedMessages;
}
