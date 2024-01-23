#!/usr/bin/env node
/* eslint-disable node/no-unsupported-features/es-syntax */
import { glob } from 'glob';
import { resolve } from 'node:path';
import { CLIApplication } from './cli/cli-application.js';
import { Command } from './cli/commands/command.interface.js';

const WINDOWS_FILE_PROTOCOL = 'file:///';
const COMMANDS_DIR = 'src/cli/commands/';

async function bootstrap() {
  const application = new CLIApplication();
  const importedCommands: Command[] = [];
  const commandFiles = glob.sync(`${COMMANDS_DIR}/*.command.ts`);

  for(const file of commandFiles) {
    const filePath = resolve(file);
    const commandPath = `${WINDOWS_FILE_PROTOCOL}${filePath}`;
    const importedModule = await import(commandPath);
    const [CommandClassName] = Object.keys(importedModule);

    if(typeof importedModule[CommandClassName] !== 'function') {
      return;
    }

    const commandInstance = new importedModule[CommandClassName]();

    if(!importedCommands[commandInstance]) {
      importedCommands.push(commandInstance);
    }
  }

  application.registrCommands(importedCommands);
  application.executeCommand(process.argv);
}

bootstrap();
