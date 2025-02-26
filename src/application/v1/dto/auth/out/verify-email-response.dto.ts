import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponseDto {
  @ApiProperty({
    description: '인증 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '인증 결과 메시지',
    example: 'Email verified successfully',
  })
  message: string;
}
