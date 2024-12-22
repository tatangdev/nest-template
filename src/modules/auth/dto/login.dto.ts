import { IsEmail, IsString } from 'class-validator';
import { BasicResponseDto } from 'src/common/utils/response-format.util';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginResponseDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}

export class LoginResponse extends BasicResponseDto {
  success: boolean;
  message: string;
  error: any;
  data: LoginResponseDto | null;
}
