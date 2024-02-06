/* eslint-disable node/no-unsupported-features/es-syntax */
import { resolve } from 'node:path';
import { Command } from '../cli/commands/command.interface.js';
import { glob } from 'glob';
import { Logger } from '../shared/libs/logger/logger.interface.js';
import { PinoLogger } from '../shared/libs/logger/pino.logger.js';

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

export async function parseCommands(): Promise<Command[] | []> {
  const logger: Logger = new PinoLogger(false);
  const parsedCommands: Command[] = [];
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

      if(!parsedCommands[commandInstance]) {
        parsedCommands.push(commandInstance);
      }
    } catch(err) {
      logger.error(ErrorText.IMPORT, err);

      if(err instanceof Error) {
        logger.error(err.message);
      }
    }
  }

  logger.info(`${MessageText.PARSED_COMMANDS} ${parsedCommands.length}`);

  return parsedCommands;
}
