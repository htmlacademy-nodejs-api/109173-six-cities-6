import { ValidationError } from 'class-validator';

export function getPrettyErrors(errors: ValidationError[]) {
  const prettifiedMessages = errors?.map((error) => ({
    property: error.property,
    received: error.value,
    requirements: error.constraints
  }));

  return prettifiedMessages;
}
