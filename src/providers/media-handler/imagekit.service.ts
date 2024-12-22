import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
import path from 'path';
import { MediaDTO } from 'src/modules/media/dto/upload-file.dto';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/common/interfaces/configuration.interface';

@Injectable()
export class ImagekitService {
  private imagekit: ImageKit;

  constructor(private configService: ConfigService<Configuration>) {
    this.imagekit = new ImageKit({
      publicKey: this.configService.get('imagekit.publicKey', { infer: true }),
      privateKey: this.configService.get('imagekit.privateKey', {
        infer: true,
      }),
      urlEndpoint: this.configService.get('imagekit.urlEndpoint', {
        infer: true,
      }),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<MediaDTO> {
    const { url } = await this.imagekit.upload({
      fileName: Date.now() + path.extname(file.originalname),
      file: file.buffer.toString('base64'),
      folder: this.configService.get('appName', { infer: true }),
    });

    return {
      url,
    };
  }
}
