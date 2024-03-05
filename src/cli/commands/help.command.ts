import { COMMAND_BEGINNING } from '../cli.constant.js';
import { Command } from './command.interface.js';
import chalk from 'chalk';

const COMMAND_NAME = `${COMMAND_BEGINNING}help`;
export class HelpCommand implements Command {
  constructor() {}

  getName() {
    return COMMAND_NAME;
  }

  execute() {
    console.info(`
                  ╔╦╗════════╔═╗═════╔╦╗══════
                  ║╩╠═╦═╦═╦╦╗║║╠═╦╦╦╗║║╠═╦═╦╦╗
                  ║╦║╬║╬║╬║║║║║║╩╣║║║╠╗║╩╣╬║╔╝
                  ╚╩╩╩╣╔╣╔╬╗║╚╩╩═╩══╝╚═╩═╩╩╩╝
                  ════╚╝╚╝╚═╝═════════════════
      ${chalk.cyan('Программа для подготовки данных для REST API сервера.')}

      Пример: npm run ts ./src/main.cli.ts --<${chalk.blue('command')}> [--arguments]

      Команды:

        ${chalk.magenta('--version:')}                    ${chalk.cyan('# выводит номер версии')}
        ${chalk.magenta('--help:')}                       ${chalk.cyan('# печатает этот текст')}
        ${chalk.magenta('--import')} <${chalk.blue('path')}>:             ${chalk.cyan(' # импортирует данные из TSV')}
        ${chalk.magenta('--generate:')} <${chalk.blue('n')}> <${chalk.blue('path')}> <${chalk.blue('url')}>  ${chalk.cyan('# генерирует произвольное количество тестовых данных')}
    `);
  }
}
