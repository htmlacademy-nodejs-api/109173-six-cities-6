const MOCK_IMAGES_SERVICE = 'https://robohash.org/';

export function getMockImageURL() {
  return `${MOCK_IMAGES_SERVICE}${crypto.randomUUID().slice(0, 8)}`;
}
