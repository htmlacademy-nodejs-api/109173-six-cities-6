import { Command } from './command.interface.js';
import chalk from 'chalk';

const Settings = {
  COMMAND_NAME: '--help',
} as const;

export class HelpCommand implements Command {
  constructor() {}

  getName() {
    return Settings.COMMAND_NAME;
  }

  execute() {
    console.info(`
      ${chalk.cyan('Программа для подготовки данных для REST API сервера.')}

      Пример: cli.js --<${chalk.blue('command')}> [--arguments]

      Команды:

      ${chalk.magenta('--version:')}                   # выводит номер версии
      ${chalk.magenta('--help:')}                      # печатает этот текст
      ${chalk.magenta('--import')} <path>:             # импортирует данные из TSV
      ${chalk.magenta('--generate:')} <n> <path> <url>  # генерирует произвольное количество тестовых данных
    `);
  }
}
