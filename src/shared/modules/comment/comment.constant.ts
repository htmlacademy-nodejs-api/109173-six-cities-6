export const COMMENTS_COUNT = 50;

export const CommentProps = {
  text: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 1024,
  },
  rating: {
    MIN: 1,
    MAX: 5
  },
} as const;
