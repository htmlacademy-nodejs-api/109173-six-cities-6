import { readdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function getCurrentModuleDirectoryPath() {
  const modulePath = fileURLToPath(import.meta.url);
  return dirname(modulePath);
}

export function getDirectoryFiles(path: string): string[] {
  const filesPath = resolve(path);
  const directoryFiles: string[] = readdirSync(filesPath);

  const filteredFiles = directoryFiles.filter((file) => {
    const filename = `${path}/${file}`;
    const isDirectory = statSync(filename).isDirectory();
    const isHidden = file.startsWith('.');

    return !(isDirectory || isHidden);
  });

  return filteredFiles;
}
