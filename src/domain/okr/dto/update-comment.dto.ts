import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({
    description: '수정할 댓글 내용',
    example: '이 OKR의 진행 상황이 매우 좋아 보입니다. 계속 이대로 진행해주세요.',
  })
  @IsString()
  content: string;
}
