import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Mail } from 'src/mail/entities/mail.entity';
import { Logger } from 'winston';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async sendMail({ to, subject, template, context }: Mail) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
    } catch (error) {
      this.logger.error(`Error sending email ${error}`);
      //   throw new Error('Failed to send email');
    }
  }
}
