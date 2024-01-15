import { User } from './user.type.js';

export type Comment = {
  text: number,
  date: string,
  rating: number,
  author: User,
};
