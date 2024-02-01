import { Document, Schema, model } from 'mongoose';
import { User } from '../../types/user.type.js';

export interface UserDocument extends User, Document {
  createdAt: Date,
  updatedAt: Date,
}

const ErrorText = {
  NAME_MIN: 'User name must contain at least 1 symbol. Got {VALUE}',
  NAME_MAX: 'User name length mustn`t be more than 15 symbols. Got {VALUE}',
  PASSWORD_MIN: 'User password must contain at least 6 symbols. Got {VALUE}',
  PASSWORD_MAX: 'User password length mustn`t be more than 12 symbols. Got {VALUE}',
} as const;

const userSchema = new Schema({
  name: {
    type: String,
    minlength: [1, ErrorText.NAME_MIN],
    maxlength: [15, ErrorText.NAME_MAX]
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatarUrl: {
    type: String,
    default: '/some/avatar/url.jpg'
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 12
  },
  isPro: Boolean,
}, { timestamps: true });

export const UserModel = model<UserDocument>('User', userSchema);
