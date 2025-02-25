import { IsString, IsEnum, IsOptional, IsUrl, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeliverableType } from '../../../common/entities/Deliverable.entity';

export class CreateDeliverableDto {
  @ApiProperty({
    description: '산출물 이름',
    example: '2024년 1분기 OKR 보고서',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '산출물 유형 (FILE 또는 LINK)',
    enum: DeliverableType,
    example: DeliverableType.FILE,
  })
  @IsEnum(DeliverableType)
  type: DeliverableType;

  @ApiProperty({
    description: '파일 경로 (type이 FILE인 경우)',
    required: false,
    example: '/uploads/documents/report.pdf',
  })
  @IsOptional()
  @IsString()
  file_path?: string;

  @ApiProperty({
    description: '링크 URL (type이 LINK인 경우)',
    required: false,
    example: 'https://example.com/document',
  })
  @IsOptional()
  @IsUrl()
  link?: string;

  @ApiProperty({
    description: '등록자 ID',
    example: 1,
  })
  @IsNumber()
  creator_id: number;
}
