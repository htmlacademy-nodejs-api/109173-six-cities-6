/* eslint-disable node/no-unsupported-features/es-syntax */
import { resolve } from 'node:path';
import { Command } from '../cli/commands/command.interface.js';
import { glob } from 'glob';

const WINDOWS_FILE_PROTOCOL = 'file:///';
const COMMANDS_DIR = 'src/cli/commands/';

export async function parseCommands(): Promise<Command[] | []> {
  const parsedCommands: Command[] = [];
  const commandFiles = glob.sync(`${COMMANDS_DIR}/*.command.ts`);

  for(const file of commandFiles) {
    const filePath = resolve(file);
    const commandPath = `${WINDOWS_FILE_PROTOCOL}${filePath}`;
    const importedModule = await import(commandPath);
    const [CommandClassName] = Object.keys(importedModule);

    if(typeof importedModule[CommandClassName] !== 'function') {
      continue;
    }

    const commandInstance = new importedModule[CommandClassName]();

    if(!parsedCommands[commandInstance]) {
      parsedCommands.push(commandInstance);
    }
  }

  return parsedCommands;
}
