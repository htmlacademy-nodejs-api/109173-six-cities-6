import { ClassConstructor, plainToClass } from 'class-transformer';

const RandomBoolean = {
  MIN: 0,
  MAX: 1,
  THRESHOLD: 0.5
} as const;

const RandomInRange = {
  MIN: 0
} as const;

function upperCaseFirst(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function getRandomInRange(min: number = RandomInRange.MIN, max: number = Infinity) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomBoolean() {
  return getRandomInRange(RandomBoolean.MIN, RandomBoolean.MAX) >= RandomBoolean.THRESHOLD;
}

function getRandomElement<T>(array: T[]): T {
  const randomIndex = getRandomInRange(RandomInRange.MIN, array.length - 1);

  return array[randomIndex];
}

function getRandomElements<T>(array: T[], elementsCount?: number): T[] {
  const elemsCount = elementsCount ?? getRandomInRange(RandomInRange.MIN, array.length - 1);

  return Array.from({length: elemsCount}, () => getRandomElement(array));
}

function fillDTO<D, O>(dto: ClassConstructor<D>, plainObject: O) {
  return plainToClass(dto, plainObject, { excludeExtraneousValues: true });
}

function getFullServerPath(protocol: string, host: string, port: number) {
  return `${protocol}://${host}:${port}`;
}

function isObject(value: unknown): value is Record<string, object> {
  return (typeof value === 'object' && value !== null);
}

function isValidURL(value: string): boolean {
  try {
    const url = new URL(value);

    return Boolean(url);
  } catch(err) {
    return false;
  }
}

export {
  upperCaseFirst,
  getRandomInRange,
  getRandomBoolean,
  getRandomElement,
  getRandomElements,
  fillDTO,
  getFullServerPath,
  isObject,
  isValidURL
};
