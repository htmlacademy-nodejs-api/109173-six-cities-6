#!/usr/bin/env node
import 'reflect-metadata';
import { CLIApplication } from './cli/cli-application.js';
import { Command } from './cli/commands/command.interface.js';
import { importCommands } from './utils/cli.js';
import { RestConfig } from './shared/libs/config/rest.config.js';
import { PinoLogger } from './shared/libs/logger/pino.logger.js';
import { getSHA256Hash } from './utils/hash.js';


async function bootstrap() {
  const importedCommands: Command[] = await importCommands();

  const aplication = new CLIApplication();

  aplication.registrCommands(importedCommands);
  aplication.executeCommand(process.argv);

  const logger = new PinoLogger();
  const config = new RestConfig(logger);
  const salt = config.get('SALT');
  const testPassword = '1qzad@#ECC';
  console.log(`Password: ${testPassword} | GeneratedHash: ${getSHA256Hash(testPassword, salt)}`);
}

bootstrap();
