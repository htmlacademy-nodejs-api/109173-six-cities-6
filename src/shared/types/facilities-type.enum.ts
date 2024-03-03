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

type FacilitiesTypeKeys = keyof typeof FacilitiesTypes
export type FacilitiesType = (typeof FacilitiesTypes)[FacilitiesTypeKeys];

export const facilitiesTypeList: FacilitiesType[] = [
  'Breakfast',
  'Air conditioning',
  'Laptop',
  'friendly workspace',
  'Baby seat',
  'Washer',
  'Towels',
  'Fridge'
];
