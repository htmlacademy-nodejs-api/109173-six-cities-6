import { Container } from 'inversify';
import { AuthService } from './auth-service.interface.js';
import { DefaultAuthService } from './default-auth.service.js';
import { Component } from '../../types/component.enum.js';
import { ExceptionFilter } from '../../libs/rest/exception-filter/exception-filter.interface.js';
import { AuthExceptionFilter } from './exception-filter/auth-exception-filter.js';

export function createAuthContainer(): Container {
  const container = new Container();

  container.bind<AuthService>(Component.AuthService).to(DefaultAuthService).inSingletonScope();
  container.bind<ExceptionFilter>(Component.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();

  return container;
}
