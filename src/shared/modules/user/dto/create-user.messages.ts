export const UserErrorText = {
  name: {
    MIN: '$property must contain at least $constraint1 symbol',
    MAX: '$property length mustn`t be more than $constraint1 symbols',
  },
  email: {
    NOT_EMAIL: '$property must be a correct Email-string'
  },
  password: {
    MIN: '$property must contain at least $constraint1 symbol',
    MAX: '$property length mustn`t be more than $constraint1 symbols',
  },
  isPro: {
    INVALID_BOOL: '$property must be a valid Boolean value (true / false)',
  },
  token: {
    INVALID: '$property must be a correct JWT-token',
  },
} as const;
