import { Container } from 'inversify';
import { Component } from '../shared/types/component.enum.js';
import { CLIApplication } from './cli-application.js';

export function createCLIContainer(): Container {
  const container = new Container();

  container.bind<CLIApplication>(Component.CLIApplication).to(CLIApplication).inSingletonScope();

  return container;
}
