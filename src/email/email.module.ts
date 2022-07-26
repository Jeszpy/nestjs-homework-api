import { Module } from '@nestjs/common';
import { EmailRepository } from './email.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { emailSchema } from '../schemas/emails-schema';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { constants } from '../constants';
import { join } from 'path';

const schemas = [{ name: 'Emails', schema: emailSchema }];

@Module({
  imports: [
    MongooseModule.forFeature(schemas),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          ignoreTLS: true,
          secure: true,
          auth: {
            user: configService.get<string>(constants.EMAIL_FROM),
            pass: configService.get<string>(constants.EMAIL_FROM_PASSWORD),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@gmail.com>',
        },
        preview: false,
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailRepository, EmailService],
  exports: [EmailRepository],
})
export class EmailModule {}
