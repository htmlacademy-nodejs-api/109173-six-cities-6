import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Command } from './commands/command.interface.js';
import { upperCaseFirst } from '../utils/common.js';

const Settings = {
  COMMANDS_PATH: './src/cli/commands',
  ENCODING: 'utf-8',
  FILE_NAME_DELIMITER: '.',
} as const;

const ErrorText = {
  CANT_READ_DIR: `Can't read commans directory: ${Settings.COMMANDS_PATH}`,
  NO_COMMANDS: `No one commands exists in directory: ${Settings.COMMANDS_PATH}`
} as const;

type CommandCollection = Record<string, Command>;

export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(
    private readonly commandsPath: string = Settings.COMMANDS_PATH
  ){}

  async parseCommands() {
    try {
      const commandFiles = await readdir(resolve(this.commandsPath), Settings.ENCODING);
      const filteredCommandFiles = commandFiles
        .filter((file) => file.split(Settings.FILE_NAME_DELIMITER)[1] === 'command');

      if(filteredCommandFiles.length <= 0) {
        throw new Error(ErrorText.NO_COMMANDS);
      }

      filteredCommandFiles
        .map((file) => {
          const splittedFilename = file.split(Settings.FILE_NAME_DELIMITER);
          const className = `${upperCaseFirst(splittedFilename[0])}${upperCaseFirst(splittedFilename[1])}`;
          // const modulePath = `${Settings.COMMANDS_PATH}/${file}`;
          // const module = await import(modulePath);
          // console.log('EVAL: ', eval(`new ${className}();`));
          // this.commands[splittedFilename[0]] = className;
          console.log(`ClassName: ${className}`);
          console.log('Commands: ', this.commands);
        });
    } catch(err) {
      console.error(ErrorText.CANT_READ_DIR);

      if(err instanceof Error) {
        console.error(err.message);
      }
    }
  }
}
