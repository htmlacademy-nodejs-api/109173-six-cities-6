export const UserProps = {
  name: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 15,
  },
  password: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 12
  },
} as const;
