import { IsEmail, IsString } from 'class-validator';
import { BasicResponseDto } from 'src/common/utils/response-format.util';

export class RegisterDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RegisterResponseDto {
  @IsString()
  message: string;
}

export class RegisterResponse extends BasicResponseDto {
  success: boolean;
  message: string;
  error: any;
  data: RegisterResponseDto | null;
}
