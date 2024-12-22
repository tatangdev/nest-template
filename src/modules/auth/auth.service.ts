import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto, RegisterResponse } from './dto/register.dto';
import { PrismaService } from 'src/providers/database/prisma.service';
import { LoginDto, LoginResponse } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/common/interfaces/configuration.interface';
import { JwtService } from '@nestjs/jwt';
import { WhoAmIResponse } from './dto/whoami.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '@prisma/client';
import { MailService } from 'src/providers/mailer/nodemailer.service';
import { MailContentEnum } from 'src/common/enums/mail-content.enum';
import { ResendVerificationEmailRequest } from './dto/resend-email.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<Configuration>,
    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {
    this.saltRounds = configService.get('auth.passwordSaltRounds', {
      infer: true,
    });
  }

  async register(
    requestBody: RegisterDto,
    baseUrl: string,
  ): Promise<RegisterResponse> {
    let user = await this.prismaService.user.findFirst({
      where: { email: requestBody.email },
    });
    if (user) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(
      requestBody.password,
      this.saltRounds,
    );
    user = await this.prismaService.user.create({
      data: {
        firstName: requestBody.firstName,
        lastName: requestBody.lastName,
        email: requestBody.email,
        password: hashedPassword,
      },
    });

    const verificationToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      {
        secret: this.configService.get('jwt.secret', { infer: true }),
        expiresIn: '1h',
      },
    );
    const verificationLink = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

    this.mailService.sendMail({
      to: user.email,
      mailContent: MailContentEnum.VERIFY_EMAIL,
      mailContext: {
        name: `${user.firstName} ${user.lastName}`,
        verificationLink,
      },
    });

    return {
      success: true,
      message: 'Registration successful',
      error: null,
      data: {
        message: 'User registered successfully',
      },
    };
  }

  async resendVerificationEmail(
    request: ResendVerificationEmailRequest,
    baseUrl: string,
  ) {
    const user = await this.prismaService.user.findFirst({
      where: { email: request.email },
    });

    if (user && !user.emailVerifiedAt) {
      const verificationToken = await this.jwtService.signAsync({
        email: user.email,
      });
      const verificationLink = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

      this.mailService.sendMail({
        to: user.email,
        mailContent: MailContentEnum.VERIFY_EMAIL,
        mailContext: {
          name: `${user.firstName} ${user.lastName}`,
          verificationLink,
        },
      });
    }
  }

  async verifyEmail(token: string) {
    const payload = await this.jwtService.verifyAsync(token);
    const user = await this.prismaService.user.findFirst({
      where: { email: payload.email },
    });
    if (!user) throw new BadRequestException('User not found');

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: Math.floor(new Date().getTime() / 1000) },
    });
  }

  async login(requestBody: LoginDto): Promise<LoginResponse> {
    const user = await this.prismaService.user.findFirst({
      where: { email: requestBody.email },
    });
    if (!user) throw new BadRequestException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(
      requestBody.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new BadRequestException('Invalid email or password');

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);

    return {
      success: true,
      message: 'Login successful',
      error: null,
      data: { accessToken, refreshToken },
    };
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configService.get('jwt.refreshSecret', { infer: true }),
        },
      );

      const user = await this.prismaService.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.generateAccessToken(user),
        this.generateRefreshToken(user),
      ]);

      return {
        success: true,
        message: 'Token refresh successful',
        error: null,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateAccessToken(user: User): Promise<string> {
    return this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
      },
      {
        secret: this.configService.get('jwt.secret', { infer: true }),
        expiresIn: this.configService.get('jwt.expiresIn', { infer: true }),
      },
    );
  }

  private async generateRefreshToken(user: User): Promise<string> {
    return this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
      },
      {
        secret: this.configService.get('jwt.refreshSecret', { infer: true }),
        expiresIn: this.configService.get('jwt.refreshExpiresIn', {
          infer: true,
        }),
      },
    );
  }

  async whoami(userId: number): Promise<WhoAmIResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    return {
      success: true,
      message: 'User fetched successfully',
      error: null,
      data: {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
      },
    };
  }
}
