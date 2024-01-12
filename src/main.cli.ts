import { CLIApplication } from './cli/cli-application.js';
import { HelpCommand } from './cli/commands/help.command.js';
import { VersionCommand } from './cli/commands/version.command.js';

const application = new CLIApplication();

application.registrCommands([
  new HelpCommand(),
  new VersionCommand()
]);
