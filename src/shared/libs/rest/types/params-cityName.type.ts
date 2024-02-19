import { ParamsDictionary } from 'express-serve-static-core';
import { City } from '../../../types/city-type.enum.js';

export type ParamsCityName = {
  cityName: City;
} | ParamsDictionary;
