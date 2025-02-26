import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/common/entities';
export class LoginResponseDto {
  @ApiProperty({
    description: '사용자 정보 (비밀번호 제외)',
    type: User,
  })
  user: Omit<User, 'password'>;

  @ApiProperty({
    description: 'JWT 액세스 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false,
  })
  accessToken?: string;

  @ApiProperty({
    description: '새로 생성된 사용자인지 여부',
    example: true,
    required: false,
  })
  isNewUser?: boolean;

  @ApiProperty({
    description: '자동 생성된 임시 비밀번호 (새 사용자인 경우)',
    example: 'temp1234',
    required: false,
  })
  tempPassword?: string;

  @ApiProperty({
    description: '이메일 인증이 필요한지 여부',
    example: true,
    required: false,
  })
  requireEmailVerification?: boolean;
}
