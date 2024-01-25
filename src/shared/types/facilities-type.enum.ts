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

export type FacilitiesType = keyof typeof FacilitiesTypes;
