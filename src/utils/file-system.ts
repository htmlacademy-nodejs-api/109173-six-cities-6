import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export function getCurrentModuleDirectoryPath() {
  const modulePath = fileURLToPath(import.meta.url);
  return dirname(modulePath);
}
