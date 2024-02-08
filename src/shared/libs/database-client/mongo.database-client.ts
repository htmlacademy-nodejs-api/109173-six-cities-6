import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { setTimeout } from 'node:timers/promises';
import { DatabaseClient } from './database-client.interface.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../logger/logger.interface.js';

const Connection = {
  COUNT: 5,
  TIMEOUT: 1000
} as const;

const MessageText = {
  DB_INIT: 'Initializing MongoDB connection ...',
  DB_URI: 'Connection URI: ',
  DB_ATTEMPT: 'Trying to connect to database. Attempt: ',
  DB_CONNECTED: 'MongoDB successfully connected.',
  DB_DISCONNECTED: 'MongoDB successfully disconnected.'
} as const;

const ErrorText = {
  DB_INIT: 'Can`t connect to MongoDB.',
  DB_CONNECTED: 'MongoDB has already connected.',
  DB_CANT_CONNECT: 'Unable to establish database connection after attempts count: ',
} as const;

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongooseConnection: typeof Mongoose | null = null;
  private isConnected: boolean;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ){
    this.isConnected = false;
  }

  private isDatabaseConnected() {
    return this.isConnected;
  }

  public async connect(uri: string) {
    if(this.isDatabaseConnected()) {
      throw new Error(ErrorText.DB_CONNECTED);
    }

    this.logger.info(MessageText.DB_INIT);
    this.logger.info(`${MessageText.DB_URI}: ${uri}`);

    let attempt = 0;
    while(attempt < Connection.COUNT) {
      try {
        this.logger.info(`${MessageText.DB_ATTEMPT}${attempt}`);

        this.mongooseConnection = await Mongoose.connect(uri);
        this.isConnected = true;

        this.logger.info(MessageText.DB_CONNECTED);
        return;
      } catch(err) {
        attempt++;

        this.logger.error(ErrorText.DB_INIT, err);

        await setTimeout(Connection.TIMEOUT);
      }
    }

    throw new Error(ErrorText.DB_CANT_CONNECT);
  }

  public async disconnect() {
    await this.mongooseConnection?.disconnect?.();
    this.isConnected = false;
    this.logger.info(MessageText.DB_DISCONNECTED);
  }
}
