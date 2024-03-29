import { inject, injectable } from 'inversify';
import { SignJWT } from 'jose';
import { LoginUserDTO } from '../user/dto/login-user.dto.js';
import { UserEntity } from '../user/user.entity.js';
import { AuthService } from './auth-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { RestConfig } from '../../libs/config/rest.config.js';
import { UserService } from '../user/user-service.interface.js';
import { TokenPayload } from '../../types/token-payload.type.js';
import { UserNotFoundException } from './errors/user-not-found.exception.js';
import { UserIncorrectPasswordException } from './errors/user-incorrect-password.exception.js';
import { makeSecretKey } from '../../../utils/encrypt.js';

const MessageText = {
  GET_TOKEN: 'Get new token for user'
} as const;

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: RestConfig,
    @inject(Component.UserService) private readonly userService: UserService,
  ){}

  getEntityName(): string {
    return 'DefaultUserAuthService';
  }

  async authenticate(user: UserEntity): Promise<string> {
    this.logger.info(`${MessageText}: ${user.email}`);

    const tokenPayload: TokenPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isPro: user.isPro,
      favoriteOffers: user.favoriteOffers,
    };

    return await this.getToken(tokenPayload);
  }

  async check(dto: LoginUserDTO): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);

    if(!user) {
      throw new UserNotFoundException();
    }

    const salt = this.config.get('SALT');
    const checkUser = user.checkPassword(dto.password, salt);

    if(!checkUser) {
      throw new UserIncorrectPasswordException();
    }

    return user;
  }

  async getToken(payload: TokenPayload, JWTSecret: string = this.config.get('JWT_SECRET')) {
    const JSTAlgorithm = this.config.get('JWT_ALGORITHM');
    const JSTExpirationTime = this.config.get('JWT_EXPIRED');

    const secretKey = makeSecretKey(JWTSecret);

    return await new SignJWT(payload)
      .setProtectedHeader({ alg: JSTAlgorithm })
      .setExpirationTime(JSTExpirationTime)
      .setIssuedAt()
      .sign(secretKey);
  }
}
