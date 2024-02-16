import { ParamsDictionary } from 'express-serve-static-core';

export type ParamsUserId = {
  userId: string;
} | ParamsDictionary;
