const MOCK_IMAGES_SERVICE = 'https://robohash.org/';

export function getMockImageURL() {
  return `${MOCK_IMAGES_SERVICE}${new Date().getTime()}`;
}
