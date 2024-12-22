import { ApiProperty } from '@nestjs/swagger';
import { BasicResponseDto } from 'src/common/utils/response-format.util';

export class UploadMediaRequestDTO {
  @ApiProperty({ type: 'string', format: 'binary', example: 'example.png' })
  file: Express.Multer.File;
}

export class MediaDTO {
  @ApiProperty({ example: 'http://image.com' })
  url: string;
}

export class UploadMediaResponseDTO extends BasicResponseDto {
  success: boolean;
  message: string;
  error: any;
  data: MediaDTO | null;
}
