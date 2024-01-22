function upperCaseFirst(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function getRandomInRange(min: number = 0, max: number = Infinity) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayElement<T>(array: T[]) {
  const randomIndex = getRandomInRange(0, array.length);

  return array[randomIndex];
}

function getRandomArrayElements<T>(array: T[], elementsCount: number) {
  const elemsCount = elementsCount ?? getRandomInRange(0, array.length);

  return Array.from({length: elemsCount}, () => getRandomArrayElement(array));
}

export {
  upperCaseFirst,
  getRandomInRange,
  getRandomArrayElement,
  getRandomArrayElements
};
