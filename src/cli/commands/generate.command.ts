import { Command } from './command.interface.js';

const Settings = {
  COMMAND_NAME: '--generate',
  ENCODING: 'utf-8'
} as const;

export class GenerateCommand implements Command {
  getName(): string {
    return Settings.COMMAND_NAME;
  }

  execute() {
    console.log(Settings.COMMAND_NAME);
  }
}
