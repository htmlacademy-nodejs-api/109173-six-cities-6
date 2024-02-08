import { injectable } from 'inversify';
import { CommandParser } from './command-parser.js';
import { Command } from './commands/command.interface.js';

const DEFAULT_COMMAND = '--help';

const ErrorText = {
  ALREADY_EXISTS: 'Command already exists:',
  NO_DEFAULT_COMMAND: 'Default command doesn`t registered.'
} as const;

type CommandCollection = Record<string, Command>;

@injectable()
export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string = DEFAULT_COMMAND
  ) {}

  public registrCommands(commandClassList: Command[]): void {
    commandClassList.forEach((commandClass) => {
      if(Object.hasOwn(this.commands, commandClass.getName())) {
        throw new Error(`${ErrorText.ALREADY_EXISTS} ${commandClass.getName()}`);
      }

      this.commands[commandClass.getName()] = commandClass;
    });
  }

  public getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand() {
    if(!this.commands[this.defaultCommand]) {
      throw new Error(ErrorText.NO_DEFAULT_COMMAND);
    }

    return this.commands[this.defaultCommand];
  }

  public executeCommand(cliArgv: string[]):void {
    const parsedCommands = CommandParser.parse(cliArgv);
    const [commandName] = Object.keys(parsedCommands);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommands[commandName] ?? [];
    command.execute(...commandArguments);
  }
}
