import { ParamsDictionary } from 'express-serve-static-core';

export type ParamsOfferId = {
  offerId: string;
} | ParamsDictionary;
