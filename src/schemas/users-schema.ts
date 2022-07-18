import * as mongoose from 'mongoose';
import {
  EmailConfirmationType,
  LoginAttemptType,
  SentConfirmationEmailType,
  UserAccountDBType,
  UserAccountType,
} from '../types/user';

const userAccountSchema = new mongoose.Schema<UserAccountType>({
  id: { type: String, required: true },
  login: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const loginAttemptSchema = new mongoose.Schema<LoginAttemptType>({
  attemptDate: { type: Date, default: Date.now },
  ip: { type: String, required: true },
});

const sentConfirmationEmailSchema =
  new mongoose.Schema<SentConfirmationEmailType>({
    sentDate: { type: Date },
  });

const emailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
  isConfirmed: { type: Boolean, default: false },
  confirmationCode: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  sentEmails: [sentConfirmationEmailSchema],
});

export const usersSchema = new mongoose.Schema<UserAccountDBType>({
  accountData: userAccountSchema,
  loginAttempts: [loginAttemptSchema],
  emailConfirmation: emailConfirmationSchema,
});
