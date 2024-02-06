#!/usr/bin/env node
import 'reflect-metadata';
import { CLIApplication } from './cli/cli-application.js';
import { Command } from './cli/commands/command.interface.js';
import { importCommands } from './utils/cli.js';


async function bootstrap() {
  const importedCommands: Command[] = await importCommands();

  const aplication = new CLIApplication();

  aplication.registrCommands(importedCommands);
  aplication.executeCommand(process.argv);
}

bootstrap();
