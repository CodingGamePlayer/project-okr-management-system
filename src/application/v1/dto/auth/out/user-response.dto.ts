import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/common/entities';

export class UserResponseDto {
  @ApiProperty({
    description: '사용자 정보',
    type: User,
  })
  user: Omit<User, 'password'>;
}
