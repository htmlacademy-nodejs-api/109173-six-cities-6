export const OfferTypes = {
  Apartment: 'apartment',
  House: 'house',
  Room: 'room',
  Hotel: 'hotel',
} as const;

export type OfferType = keyof typeof OfferTypes;
