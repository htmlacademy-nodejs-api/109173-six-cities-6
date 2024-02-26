export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  CLIApplication: Symbol.for('CLIApplication'),
  AppExceptionFilter: Symbol.for('AppExceptionFilter'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),

  UserModel: Symbol.for('UserModel'),
  UserService: Symbol.for('UserService'),
  UserController: Symbol.for('UserController'),

  OfferModel: Symbol.for('OfferModel'),
  OfferService: Symbol.for('OfferService'),
  OfferController: Symbol.for('OfferController'),

  CommentModel: Symbol.for('CommentModel'),
  CommentService: Symbol.for('CommentService'),
  CommentController: Symbol.for('CommentController'),

  AuthService: Symbol.for('AuthService'),
  AuthExceptionFilter: Symbol.for('AuthExceptionFilter')
} as const;
