export const CommentErrorText = {
  text: {
    MIN: '$property must contain at least $constraint1 symbols',
    MAX: '$property mustn`t contain more than $constraint1 symbols'
  },
  rating: {
    MIN: '$property must be >= $constraint1',
    MAX: '$property must be <= $constraint1'
  },
} as const;
