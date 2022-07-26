import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { EmailType } from '../types/emails';

@Injectable()
export class EmailRepository {
  constructor(
    @InjectModel('Emails') private emailModel: mongoose.Model<EmailType>,
  ) {}
  async insertEmailToQueue(emailInfo: EmailType): Promise<boolean> {
    await this.emailModel.create(emailInfo);
    return true;
  }

  async getEmailFromQueue(): Promise<EmailType | null> {
    const email = await this.emailModel
      .find({ status: 'pending' }, { projection: { _id: false } })
      .sort({ createdAt: -1 })
      .limit(1);
    if (!email[0]) {
      return null;
    }
    const id = email[0].id;
    await this.emailModel.updateOne({ id }, { $set: { status: 'sending' } });
    return email[0];
  }

  async changeStatus(emailId: string, newStatus: string): Promise<boolean> {
    const result = await this.emailModel.updateOne(
      { id: emailId },
      { $set: { status: newStatus } },
    );
    return result.modifiedCount === 1;
  }
}
