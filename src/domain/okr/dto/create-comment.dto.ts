import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: '댓글 내용',
    example: '이 OKR의 진행 상황이 매우 좋아 보입니다.',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: '부모 댓글 ID (대댓글인 경우)',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  parent_id?: number;
}
