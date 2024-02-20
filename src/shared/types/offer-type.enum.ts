export const OfferTypes = {
  Apartment: 'apartment',
  House: 'house',
  Room: 'room',
  Hotel: 'hotel',
} as const;

type OfferTypeKeys = keyof typeof OfferTypes
export type OfferType = (typeof OfferTypes)[OfferTypeKeys];
export const _offerTypes: OfferType[] = ['apartment', 'house', 'room', 'hotel'] as const;
