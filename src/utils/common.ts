import { ClassConstructor, plainToClass } from 'class-transformer';

function upperCaseFirst(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function getRandomInRange(min: number = 0, max: number = Infinity) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomBoolean() {
  return getRandomInRange(0, 1) >= 0.5;
}

function getRandomElement<T>(array: T[]): T {
  const randomIndex = getRandomInRange(0, array.length - 1);

  return array[randomIndex];
}

function getRandomElements<T>(array: T[], elementsCount?: number): T[] {
  const elemsCount = elementsCount ?? getRandomInRange(1, array.length - 1);

  return Array.from({length: elemsCount}, () => getRandomElement(array));
}

function fillDTO<D, O>(dto: ClassConstructor<D>, plainObject: O) {
  return plainToClass(dto, plainObject, { excludeExtraneousValues: true });
}

function getFullServerPath(protocol: string, host: string, port: number) {
  return `${protocol}://${host}:${port}`;
}

export {
  upperCaseFirst,
  getRandomInRange,
  getRandomBoolean,
  getRandomElement,
  getRandomElements,
  fillDTO,
  getFullServerPath
};
