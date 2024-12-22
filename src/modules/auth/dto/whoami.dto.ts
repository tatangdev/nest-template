import { IsEmail, IsNumber, IsString } from 'class-validator';
import { BasicResponseDto } from 'src/common/utils/response-format.util';

export class WhoAmIDto {
  @IsNumber()
  id: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;
}

export class WhoAmIResponse extends BasicResponseDto {
  success: boolean;
  message: string;
  error: any;
  data: WhoAmIDto | null;
}
