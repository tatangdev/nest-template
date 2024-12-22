import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/auth.decorator';
import {
  UploadMediaRequestDTO,
  UploadMediaResponseDTO,
} from './dto/upload-file.dto';
import { MediaService } from './media.service';

@Controller()
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('images')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, type: UploadMediaResponseDTO })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadMediaRequestDTO,
    required: true,
    description: 'File to upload',
  })
  async uploadFileAndFailValidation(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UploadMediaResponseDTO> {
    return await this.mediaService.uploadFile(file);
  }
}
