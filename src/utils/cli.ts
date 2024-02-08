/* eslint-disable node/no-unsupported-features/es-syntax */
import { resolve } from 'node:path';
import { Command } from '../cli/commands/command.interface.js';
import { glob } from 'glob';
import { Logger } from '../shared/libs/logger/logger.interface.js';
import { ConsoleLogger } from '../shared/libs/logger/console.logger.js';

const WINDOWS_FILE_PROTOCOL = 'file:///';
const COMMANDS_DIR = 'src/cli/commands/';

const MessageText = {
  PARSE: 'Trying to parse command:',
  SUCCESS: 'Command successfully parsed:',
  PARSED_COMMANDS: 'Parsed commands count:',
} as const;

const ErrorText = {
  IMPORT: ' Can`t import command module. Error:'
} as const;

export async function importCommands(): Promise<Command[] | []> {
  const logger: Logger = new ConsoleLogger();
  const importedCommands: Command[] = [];
  const commandFiles = glob.sync(`${COMMANDS_DIR}/*.command.ts`);

  for(const file of commandFiles) {
    logger.info(`${MessageText.PARSE} ${file}`);

    const filePath = resolve(file);
    const commandPath = `${WINDOWS_FILE_PROTOCOL}${filePath}`;

    try {
      const importedModule = await import(commandPath);
      const [CommandClassName] = Object.keys(importedModule);

      if(typeof importedModule[CommandClassName] !== 'function') {
        continue;
      }


      const commandInstance = new importedModule[CommandClassName]();

      logger.info(`${MessageText.SUCCESS} ${CommandClassName}`);

      if(!importedCommands[commandInstance]) {
        importedCommands.push(commandInstance);
      }
    } catch(err) {
      logger.error(ErrorText.IMPORT, err);

      if(err instanceof Error) {
        logger.error(err.message);
      }
    }
  }

  logger.info(`${MessageText.PARSED_COMMANDS} ${importedCommands.length}`);

  return importedCommands;
}
