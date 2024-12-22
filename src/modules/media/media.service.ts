import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/common/interfaces/configuration.interface';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/providers/mailer/nodemailer.service';
import { UploadMediaResponseDTO } from './dto/upload-file.dto';
import { ImagekitService } from 'src/providers/media-handler/imagekit.service';

@Injectable()
export class MediaService {
  constructor(private readonly imagakit: ImagekitService) {}

  async uploadFile(file: Express.Multer.File): Promise<UploadMediaResponseDTO> {
    const data = await this.imagakit.uploadFile(file);

    return {
      success: true,
      message: 'File uploaded successfully',
      error: null,
      data: data,
    };
  }
}
