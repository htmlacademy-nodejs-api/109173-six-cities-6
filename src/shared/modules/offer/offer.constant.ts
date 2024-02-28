export const MAX_OFFERS_COUNT = 60;
export const PREMIUM_OFFERS_COUNT = 3;

export const OfferProps = {
  name: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 20,
  },
  description: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 1024
  },
  images: {
    MIN_COUNT: 6
  },
  rating: {
    DEFAULT: 0,
    MIN: 1,
    MAX: 5,
  },
  rooms: {
    MIN: 1,
    MAX: 8,
  },
  guests: {
    MIN: 1,
    MAX: 10,
  },
  price: {
    MIN: 100,
    MAX: 100000,
  },
} as const;
