function upperCaseFirst(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function getRandomInRange(min: number = 0, max: number = Infinity) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomBoolean() {
  return !!getRandomInRange(0, 1);
}

function getRandomElement<T>(array: T[]): T {
  const randomIndex = getRandomInRange(0, array.length - 1);

  return array[randomIndex];
}

function getRandomElements<T>(array: T[], elementsCount?: number): T[] {
  const elemsCount = elementsCount ?? getRandomInRange(0, array.length - 1);

  return Array.from({length: elemsCount}, () => getRandomElement(array));
}

export {
  upperCaseFirst,
  getRandomInRange,
  getRandomBoolean,
  getRandomElement,
  getRandomElements,
};
