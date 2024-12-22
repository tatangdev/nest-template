import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MailContentEnum } from 'src/common/enums/mail-content.enum';

export class MailSendDto {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsEnum(MailContentEnum)
  mailContent: keyof typeof MailContentEnum;
  mailContext?: any;
}
