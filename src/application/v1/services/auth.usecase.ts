import { BadRequestException, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User, Role } from 'src/common/entities';
import { RoleService } from 'src/domain/role/role.service';
import { CreateUserDto } from 'src/domain/user/dto/create-user.dto';
import { UserService } from 'src/domain/user/user.service';
import * as nodemailer from 'nodemailer';
import { LoginResponseDto } from '../dto/auth/out/login-response.dto';
import { VerifyEmailResponseDto } from '../dto/auth/out/verify-email-response.dto';
import { ChangePasswordDto } from '../dto/auth/in/change-password.dto';
import { UpdateProfileDto } from '../dto/auth/in/update-profile.dto';

// 기존 인터페이스는 내부 사용을 위해 유지하거나 완전히 DTO로 대체할 수 있습니다
export { LoginResponseDto as LoginResponse };
export { VerifyEmailResponseDto as VerifyEmailResponse };

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface UpdateProfileRequest {
  username?: string;
  email?: string;
}

@Injectable()
export class AuthUsecase {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  /**
   * 이메일을 사용하여 로그인 (사용자가 없으면 자동 회원가입)
   * @param email 사용자 이메일
   * @param password 사용자 비밀번호 (선택적)
   * @param username 사용자 이름 (자동 회원가입 시 필요)
   */
  async login(email: string, password?: string, username?: string): Promise<LoginResponseDto> {
    // 이메일로 사용자 찾기
    let user = await this.userService.findByEmail(email, !!password);

    // 사용자가 없으면 자동 회원가입
    if (!user) {
      // 자동 회원가입을 위한 사용자 이름이 제공되지 않은 경우
      if (!username) {
        // 이메일에서 @ 앞부분을 사용자 이름으로 사용
        username = email.split('@')[0];
      }

      // 임시 비밀번호 생성 (실제로는 더 복잡한 로직이 필요할 수 있음)
      const tempPassword = Math.random().toString(36).slice(-8);

      try {
        // 새 사용자 생성
        const createUserDto: CreateUserDto = {
          email,
          username,
          password: tempPassword,
        };

        user = await this.register(createUserDto);

        console.log(`자동 회원가입 완료: ${email}, 임시 비밀번호: ${tempPassword}`);

        // 자동 회원가입 시에는 이메일 인증 없이 로그인 허용 (선택적)
        // 또는 이메일 인증이 필요하다는 메시지와 함께 특별한 응답 반환
        return {
          user: { ...user, password: undefined } as any,
          isNewUser: true,
          tempPassword,
          requireEmailVerification: true,
        };
      } catch (error) {
        throw new BadRequestException('자동 회원가입 중 오류가 발생했습니다: ' + error.message);
      }
    }

    // 기존 사용자 로그인 로직
    // 비밀번호가 제공된 경우 검증
    if (password) {
      const isPasswordValid = await this.userService.validatePassword(user, password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }
    }

    // 이메일 인증 확인 (필요한 경우)
    // 자동 회원가입 사용자는 이미 위에서 처리했으므로 여기서는 기존 사용자만 확인
    if (!user.isVerified) {
      // 이메일 인증이 필요하다는 정보와 함께 응답
      return {
        user: { ...user, password: undefined } as any,
        requireEmailVerification: true,
      };
    }

    // JWT 토큰 생성
    const accessToken = this.generateToken(user);

    // 비밀번호 필드 제외하고 반환
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as any,
      accessToken,
      requireEmailVerification: false,
    };
  }

  /**
   * 새 사용자 등록
   * @param createUserDto 사용자 생성 DTO
   */
  async register(createUserDto: CreateUserDto): Promise<User> {
    // UserService의 create 메서드 활용
    const user = await this.userService.create(createUserDto);

    // GUEST 역할 찾기 또는 생성
    let guestRole: Role | null;

    try {
      // 먼저 GUEST 역할이 있는지 확인
      guestRole = await this.roleService.findByNameOrNull('GUEST');

      // GUEST 역할이 없으면 생성
      if (!guestRole) {
        console.log('GUEST 역할이 없어 새로 생성합니다.');
        guestRole = await this.roleService.create({ name: 'GUEST' });
      }

      // 사용자에게 GUEST 역할 할당
      await this.userService.assignRole(user.id, guestRole.id);
      console.log(`사용자 ${user.username}에게 GUEST 역할이 할당되었습니다.`);
    } catch (error) {
      // 역할 할당 실패 시 로깅만 하고 계속 진행
      console.error('기본 역할 할당 중 오류 발생:', error);
    }

    // 이메일 인증 요청 발송
    await this.requestEmailVerification(user.id);

    return user;
  }

  /**
   * 이메일 인증 요청
   * @param userId 사용자 ID
   */
  async requestEmailVerification(userId: number): Promise<void> {
    const user = await this.userService.findOne(userId);

    // 이미 인증된 경우
    if (user.isVerified) {
      throw new BadRequestException('이미 인증된 이메일입니다');
    }

    // 인증 토큰 생성
    const token = this.generateEmailVerificationToken(user);

    // 이메일 전송 설정
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 프론트엔드 URL 설정
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // 인증 링크 생성 - 컨트롤러 경로와 일치하도록 수정
    // 프론트엔드에서 이 토큰을 받아 백엔드 API를 호출하도록 구성
    const verificationLink = `${frontendUrl}/auth/verify-email?token=${token}`;

    // 이메일 내용 구성
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"OKR 시스템" <noreply@example.com>',
      to: user.email,
      subject: '이메일 주소 인증',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">이메일 주소 인증</h2>
          <p>안녕하세요, ${user.username}님!</p>
          <p>OKR 관리 시스템에 가입해 주셔서 감사합니다. 아래 버튼을 클릭하여 이메일 주소를 인증해 주세요:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">이메일 인증하기</a>
          </div>
          <p>또는 다음 링크를 브라우저에 복사하여 붙여넣으세요:</p>
          <p style="word-break: break-all;">${verificationLink}</p>
          <p>이 링크는 24시간 동안 유효합니다.</p>
          <p>감사합니다,<br>OKR 관리 시스템 팀</p>
        </div>
      `,
    };

    try {
      // 이메일 발송
      const info = await transporter.sendMail(mailOptions);
      console.log(`이메일 인증 메일 발송 완료: ${info.messageId}`);
    } catch (error) {
      console.error('이메일 발송 실패:', error);
      throw new BadRequestException('이메일 발송에 실패했습니다. 나중에 다시 시도해 주세요.');
    }
  }

  /**
   * 이메일 인증 확인
   * @param token 인증 토큰
   */
  async verifyEmail(token: string): Promise<VerifyEmailResponseDto> {
    try {
      // 토큰 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

      // 사용자 찾기
      const user = await this.userService.findOne(decoded.userId);

      // 이미 인증된 경우
      if (user.isVerified) {
        return {
          success: true,
          message: 'Email already verified',
        };
      }

      // 인증 상태 업데이트
      await this.userService.verifyEmail(user.id);

      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Invalid or expired token',
      };
    }
  }

  // 토큰 생성 헬퍼 메서드
  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles?.map((role) => role.name) || [],
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1d' });
  }

  private generateEmailVerificationToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      type: 'email-verification',
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
  }

  /**
   * 비밀번호 변경
   * @param userId 사용자 ID
   * @param passwordData 비밀번호 변경 요청 데이터
   */
  async changePassword(userId: number, passwordData: ChangePasswordDto): Promise<void> {
    // 사용자 조회 (비밀번호 포함)
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다.`);
    }

    // 현재 비밀번호 검증
    const isPasswordValid = await this.userService.validatePassword(user, passwordData.currentPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('현재 비밀번호가 일치하지 않습니다.');
    }

    // 새 비밀번호가 현재 비밀번호와 같은지 확인
    if (passwordData.currentPassword === passwordData.newPassword) {
      throw new BadRequestException('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
    }

    // 비밀번호 업데이트
    await this.userService.update(userId, { password: passwordData.newPassword });

    console.log(`사용자 ID ${userId}의 비밀번호가 성공적으로 변경되었습니다.`);
  }

  /**
   * 사용자 프로필 업데이트
   * @param userId 사용자 ID
   * @param profileData 프로필 업데이트 데이터
   */
  async updateProfile(userId: number, profileData: UpdateProfileDto): Promise<User> {
    // 사용자 존재 여부 확인
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다.`);
    }

    // 이메일 변경 시 중복 확인
    if (profileData.email && profileData.email !== user.email) {
      const existingUser = await this.userService.findByEmail(profileData.email);
      if (existingUser) {
        throw new BadRequestException(`이메일 ${profileData.email}은(는) 이미 사용 중입니다.`);
      }

      // 이메일이 변경되면 인증 상태 초기화
      profileData = { ...profileData, isVerified: false };

      // 새 이메일로 인증 메일 발송 (선택적)
      // 여기서는 업데이트 후 별도로 처리
    }

    // 사용자 이름 변경 시 중복 확인
    if (profileData.username && profileData.username !== user.username) {
      // 사용자 이름 중복 확인 로직 (UserService에 해당 메서드 추가 필요)
      const existingUserWithUsername = await this.userService.findByUsername(profileData.username);
      if (existingUserWithUsername) {
        throw new BadRequestException(`사용자 이름 ${profileData.username}은(는) 이미 사용 중입니다.`);
      }
    }

    // 프로필 업데이트
    const updatedUser = await this.userService.update(userId, profileData);

    // 이메일이 변경되었고 인증 상태가 초기화된 경우 새 이메일로 인증 메일 발송
    if (profileData.email && profileData.email !== user.email) {
      try {
        await this.requestEmailVerification(userId);
      } catch (error) {
        console.error('이메일 인증 메일 발송 실패:', error);
        // 이메일 발송 실패해도 프로필 업데이트는 성공으로 처리
      }
    }

    // 비밀번호 필드 제외하고 반환
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  /**
   * 액세스 토큰 검증
   * @param token JWT 토큰
   * @returns 토큰에 해당하는 사용자 정보
   */
  async validateToken(token: string): Promise<User> {
    try {
      // 토큰 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

      // 사용자 ID 추출
      const userId = decoded.sub;

      // 사용자 정보 조회
      const user = await this.userService.findOne(userId);

      // 비밀번호 필드 제외
      const { password: _, ...userWithoutPassword } = user;

      return userWithoutPassword as User;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('만료된 토큰입니다.');
      } else {
        throw new UnauthorizedException('토큰 검증 중 오류가 발생했습니다.');
      }
    }
  }

  /**
   * 비밀번호 재설정 요청
   * @param email 사용자 이메일
   */
  async requestPasswordReset(email: string): Promise<void> {
    // 이메일로 사용자 찾기
    const user = await this.userService.findByEmail(email);
    if (!user) {
      // 보안상 사용자가 없어도 성공 메시지 반환 (이메일 존재 여부 노출 방지)
      console.log(`비밀번호 재설정 요청: 사용자 ${email}을 찾을 수 없습니다.`);
      return;
    }

    // 비밀번호 재설정 토큰 생성
    const token = this.generatePasswordResetToken(user);

    // 이메일 전송 설정
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 프론트엔드 URL 설정
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // 비밀번호 재설정 링크 생성
    const resetLink = `${frontendUrl}/auth/reset-password?token=${token}`;

    // 이메일 내용 구성
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"OKR 시스템" <noreply@example.com>',
      to: user.email,
      subject: '비밀번호 재설정 요청',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">비밀번호 재설정</h2>
          <p>안녕하세요, ${user.username}님!</p>
          <p>비밀번호 재설정을 요청하셨습니다. 아래 버튼을 클릭하여 새 비밀번호를 설정해 주세요:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">비밀번호 재설정</a>
          </div>
          <p>또는 다음 링크를 브라우저에 복사하여 붙여넣으세요:</p>
          <p style="word-break: break-all;">${resetLink}</p>
          <p>이 링크는 1시간 동안 유효합니다.</p>
          <p>비밀번호 재설정을 요청하지 않으셨다면 이 이메일을 무시하셔도 됩니다.</p>
          <p>감사합니다,<br>OKR 관리 시스템 팀</p>
        </div>
      `,
    };

    try {
      // 이메일 발송
      const info = await transporter.sendMail(mailOptions);
      console.log(`비밀번호 재설정 이메일 발송 완료: ${info.messageId}`);
    } catch (error) {
      console.error('이메일 발송 실패:', error);
      throw new BadRequestException('이메일 발송에 실패했습니다. 나중에 다시 시도해 주세요.');
    }
  }

  // 비밀번호 재설정 토큰 생성 헬퍼 메서드
  private generatePasswordResetToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      type: 'password-reset',
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
  }

  /**
   * 비밀번호 재설정
   * @param token 재설정 토큰
   * @param newPassword 새 비밀번호
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // 토큰 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

      // 토큰 타입 확인
      if (decoded.type !== 'password-reset') {
        throw new BadRequestException('유효하지 않은 토큰 타입입니다.');
      }

      // 사용자 ID 추출
      const userId = decoded.userId;

      // 사용자 존재 여부 확인
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      // 토큰의 이메일과 사용자 이메일 일치 여부 확인
      if (decoded.email !== user.email) {
        throw new BadRequestException('토큰이 유효하지 않습니다.');
      }

      // 비밀번호 업데이트
      await this.userService.update(userId, { password: newPassword });

      console.log(`사용자 ID ${userId}의 비밀번호가 성공적으로 재설정되었습니다.`);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new BadRequestException('만료된 토큰입니다. 비밀번호 재설정을 다시 요청해주세요.');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new BadRequestException('유효하지 않은 토큰입니다.');
      } else {
        // 이미 처리된 예외는 그대로 전달
        if (error instanceof BadRequestException || error instanceof NotFoundException) {
          throw error;
        }
        // 그 외 예외는 일반적인 오류 메시지로 변환
        throw new BadRequestException('비밀번호 재설정 중 오류가 발생했습니다.');
      }
    }
  }
}
