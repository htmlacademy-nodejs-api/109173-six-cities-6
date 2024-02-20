export const FacilitiesTypes = {
  Breakfast: 'Breakfast',
  Conditioning: 'Air conditioning',
  Laptop: 'Laptop',
  Workspace: 'friendly workspace',
  Babyseat: 'Baby seat',
  Washer: 'Washer',
  Towels: 'Towels',
  Fridge: 'Fridge',
} as const;

type facilitiesTypeKeys = keyof typeof FacilitiesTypes
export type FacilitiesType = (typeof FacilitiesTypes)[facilitiesTypeKeys];

export const _facilities: FacilitiesType[] =
  ['Breakfast', 'Air conditioning', 'Laptop', 'friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'] as const;
