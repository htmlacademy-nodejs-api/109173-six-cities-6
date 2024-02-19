import { ParamsDictionary } from 'express-serve-static-core';

export type ParamsFavoriteStatus = {
  offerId: string;
  status: number;
} | ParamsDictionary;
