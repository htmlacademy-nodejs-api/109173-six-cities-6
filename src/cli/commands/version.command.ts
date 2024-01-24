import { Command, ExecuteParameters } from './command.interface.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { GlobalSettings } from '../../global-settings.js';

const COMMAND_NAME = `${GlobalSettings.COMMAND_BEGINNING}version`;
const DEFAULT_FILEPATH = './package.json';

const ErrorText = {
  NOT_JSON_CONFIG: 'Failed to parse JSON config file.',
  CANT_READ: 'Can`t read version from file'
} as const;

type PackageJSONConfig = {
  version: string;
};

export class VersionCommand implements Command {
  constructor(
    private readonly filepath: string = DEFAULT_FILEPATH
  ) {}

  getName() {
    return COMMAND_NAME;
  }

  async execute(..._parameters: ExecuteParameters): Promise<void> {
    try {
      const version = this.readVersion();

      console.info(version);
    } catch(err) {
      console.error(`${ErrorText.CANT_READ}: ${this.filepath}`);

      if(err instanceof Error) {
        console.error(err.message);
      }
    }
  }

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filepath), GlobalSettings.ENCODING);
    const parsedContent: unknown = JSON.parse(jsonContent);

    if(!this.isPackageJSONConfig(parsedContent)) {
      throw new Error(ErrorText.NOT_JSON_CONFIG);
    }

    return parsedContent.version;
  }

  private isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      Object.hasOwn(value, 'version')
    );
  }
}
