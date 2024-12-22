import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import { join } from 'path';
import { MailSendDto } from './dto/sendMail.dto';
import { MailContentConfig } from 'src/common/configs/mail-content.config';
import { Configuration } from 'src/common/interfaces/configuration.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<Configuration>,
  ) {}

  async sendMail(mailSendDto: MailSendDto) {
    const mailConfig = MailContentConfig[mailSendDto.mailContent];

    try {
      const templatePath = join(
        __dirname,
        '../../../src/providers/mailer/templates',
        `${mailConfig.template}.hbs`,
      );
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const template = handlebars.compile(templateSource);
      const html = template(mailSendDto.mailContext);

      await this.mailerService.sendMail({
        to: mailSendDto.to,
        from: this.configService.get('smtp.from', { infer: true }),
        subject: mailConfig.subject,
        html: html,
      });

      this.logger.log(`Email sent successfully to ${mailSendDto.to}`);
      return `Email sent successfully to ${mailSendDto.to}`;
    } catch (error) {
      this.logger.error(`Failed to send email to ${mailSendDto.to}`, error);
    }
  }
}
