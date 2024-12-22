import { MailContentEnum } from '../enums/mail-content.enum';

export const MailContentConfig = {
  [MailContentEnum.VERIFY_EMAIL]: {
    template: 'email-verification',
    subject: 'Verify your email',
  },
};
