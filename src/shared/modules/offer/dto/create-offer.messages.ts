export const OfferErrorText = {
  name: {
    MIN: '$property must contain at least $constraint1 symbol',
    MAX: '$property length mustn`t be more than $constraint1 symbols',
  },
  description: {
    MIN: '$property must contain at least $constraint1 symbols',
    MAX: '$property mustn`t contain more than $constraint1 symbols'
  },
  date: {
    INVALID: '$property - must be a valid ISO date',
  },
  city: {
    INVALID: '$property name must be one of next values: $constraint1',
  },
  previewImage: {
    INVALID_URL: '$property must contain a correct image URL',
  },
  images: {
    MIN_COUNT: 'Offer must contain $constraint1 or more images'
  },
  isPremium: {
    INVALID_BOOL: '$property must be a valid Boolean value (true / false)'
  },
  isFavorite: {
    INVALID_BOOL: '$property must be a valid Boolean value (true / false)'
  },
  rating: {
    INCORRECT: '$property must be an integer, or decimal with 1 number after comma ( 1 | 0.1 | 1,0 | 1.2)',
    MIN: '$property must be not less than $constraint1',
    MAX: '$property must be not more than $constraint1',
  },
  type: {
    INVALID: '$property Type must be one of next values: $constraint1',
  },
  rooms: {
    NOT_INTEGER: '$property must be an integer',
    MIN: 'Offer must contain at least $constraint1 room',
    MAX: 'Offer mustn`t contain more than $constraint1 rooms',
  },
  guests: {
    NOT_INTEGER: 'Guests must be an integer',
    MIN: 'Offer must receive at least $constraint1 guest',
    MAX: 'Offer mustn`t receive more than $constraint1 guests',
  },
  price: {
    NOT_INTEGER: 'Price must be an integer',
    MIN: '$property value must be >= than $constraint1',
    MAX: '$property value must be be <= than $constraint1',
  },
  facilities: {
    INVALID: '$property can contain only next values: $constraint1',
  },
  userId: {
    INVALID_ID: '$property must contain a valid id',
  },
  commentCount: {
    NOT_INTEGER: '$property must be an integer'
  },
  coordinates: {
    NOT_OBJECT: '$property must be an Coordinates-object',
    NOT_LATITUDE: '$property must contain a correct latitude string',
    NOT_LONGTITUDE: '$property must contain a correct longtitude string'
  },
  enum: {
    INVALID: '{VALUE} is not supported'
  },
} as const;
