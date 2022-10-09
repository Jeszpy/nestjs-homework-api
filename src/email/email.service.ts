import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailRepository } from './email.repository';
import { appConstants } from '../appConstants';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private emailsRepository: EmailRepository,
  ) {}

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // * * * * * * = every second
  @Cron('* * * * * *')
  async sendEmails() {
    const emailFromQueue = await this.emailsRepository.getEmailFromQueue();
    if (emailFromQueue === null) return;
    const confirmationCode = emailFromQueue.confirmationCode;
    const url = `${appConstants.APP_URI}/auth/registration-confirmation?code=${confirmationCode}`;
    try {
      await this.mailerService.sendMail({
        to: emailFromQueue.email,
        subject: 'Welcome to Nice App! Confirm your Email',
        template: `./${emailFromQueue.subject}`,
        context: {
          name: emailFromQueue.userLogin,
          url,
        },
      });
      await this.emailsRepository.changeStatus(emailFromQueue.id, 'sent');
    } catch (e) {
      await this.emailsRepository.changeStatus(emailFromQueue.id, 'pending');
    }
  }
}
