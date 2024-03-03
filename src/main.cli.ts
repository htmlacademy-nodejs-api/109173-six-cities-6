#!/usr/bin/env node
import 'reflect-metadata';
import { CLIApplication } from './cli/cli-application.js';
import { Command } from './cli/commands/command.interface.js';
import { importCommands } from './utils/cli.js';

async function bootstrap() {
  const importedCommands: Command[] = await importCommands();

  const application = new CLIApplication();

  application.registrCommands(importedCommands);
  application.executeCommand(process.argv);
}

bootstrap();
