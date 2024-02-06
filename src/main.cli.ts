#!/usr/bin/env node
import 'reflect-metadata';
import { CLIApplication } from './cli/cli-application.js';
import { createCLIContainer } from './cli/cli.container.js';
import { Command } from './cli/commands/command.interface.js';
import { Component } from './shared/types/component.enum.js';
import { parseCommands } from './utils/cli.js';


async function bootstrap() {
  const importedCommands: Command[] = await parseCommands();

  const container = createCLIContainer();
  const aplication = container.get<CLIApplication>(Component.CLIApplication);

  aplication.registrCommands(importedCommands);
  aplication.executeCommand(process.argv);
}

bootstrap();
