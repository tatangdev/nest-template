import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsBoolean, IsString } from 'class-validator';

export class BasicResponseDto {
  @ApiProperty({
    type: Boolean,
    description: 'Success status',
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    type: String,
    description: 'Message',
  })
  @IsString()
  message: string;

  @ApiProperty({
    type: Object,
    description: 'Error',
  })
  @Allow()
  error: any;
}

export interface BasicResponse<T> {
  success: boolean;
  message: string | null;
  error: any | null;
  data: T | null;
}

export function formatResponse<T>(
  success: boolean,
  message: string | null = null,
  error: any | null = null,
  data: T | null = null,
): BasicResponse<T> {
  return {
    success,
    message,
    error,
    data,
  };
}
