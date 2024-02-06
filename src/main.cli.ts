#!/usr/bin/env node
import { CLIApplication } from './cli/cli-application.js';
import { Command } from './cli/commands/command.interface.js';
import { parseCommands } from './utils/cli.js';


async function bootstrap() {
  const application = new CLIApplication();
  const importedCommands: Command[] = await parseCommands();

  application.registrCommands(importedCommands);
  application.executeCommand(process.argv);
}

bootstrap();
