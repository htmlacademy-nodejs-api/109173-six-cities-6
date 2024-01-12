import { Command } from './commands/command.interface.js';

const ErrorText = {
  ALREADY_EXISTS: 'Command already exists:',
} as const;

type CommandCollection = Record<string, Command>;

export class CLIApplication {
  private commands: CommandCollection = {};

  public registrCommands(commandClassList: Command[]): void {
    commandClassList.forEach((commandClass) => {
      if(Object.hasOwn(this.commands, commandClass.getName())) {
        throw new Error(`${ErrorText.ALREADY_EXISTS} ${commandClass.getName()}`);
      }

      this.commands[commandClass.getName()] = commandClass;
    });

    console.log('Commands: ', this.commands);
  }
}
