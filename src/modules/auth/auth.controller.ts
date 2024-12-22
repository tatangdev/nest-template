import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Render,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterResponse } from './dto/register.dto';
import { LoginDto, LoginResponse } from './dto/login.dto';
import { Public, UserId } from 'src/common/decorators/auth.decorator';
import { WhoAmIResponse } from './dto/whoami.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { BaseUrl } from 'src/common/decorators/request.decorator';
import { ResendVerificationEmailRequest } from './dto/resend-email.dto';
import { BasicResponseDto } from 'src/common/utils/response-format.util';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @Public()
  @HttpCode(201)
  async registerUser(
    @Body() requestBody: RegisterDto,
    @BaseUrl() baseUrl: string,
  ): Promise<RegisterResponse> {
    return await this.authService.register(requestBody, baseUrl);
  }

  @Post('/resend-verification-email')
  @Public()
  @HttpCode(200)
  async resendVerificationEmail(
    @Body() request: ResendVerificationEmailRequest,
    @BaseUrl() baseUrl: string,
  ): Promise<BasicResponseDto> {
    this.authService.resendVerificationEmail(request, baseUrl);
    return {
      success: true,
      error: null,
      message: 'You will receive an email shortly if your email is registered',
    };
  }

  @Get('/verify-email')
  @Public()
  @Render('email-verified')
  async verifyEmail(@Query('token') token: string, @BaseUrl() baseUrl: string) {
    this.authService.verifyEmail(token);
    return { loginUrl: `${baseUrl}/login` };
  }

  @Post('/login')
  @Public()
  @HttpCode(200)
  async loginUser(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(loginDto);
  }

  @Get('/whoami')
  @ApiBearerAuth('access-token')
  @HttpCode(200)
  async whoami(@UserId() userId: number): Promise<WhoAmIResponse> {
    return await this.authService.whoami(userId);
  }

  @Post('/refresh')
  @Public()
  @HttpCode(200)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponse> {
    return await this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
