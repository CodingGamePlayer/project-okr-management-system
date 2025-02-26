import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'updated_username',
    description: '수정할 사용자 이름',
    required: false,
  })
  username?: string;

  @ApiProperty({
    example: 'updated@example.com',
    description: '수정할 이메일 주소',
    required: false,
  })
  email?: string;

  @ApiProperty({
    example: 'newpassword123',
    description: '수정할 비밀번호',
    required: false,
  })
  password?: string;
}
