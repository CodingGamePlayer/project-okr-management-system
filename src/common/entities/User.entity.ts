import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Role } from './Role.entity';
import { ProjectAssignment } from './ProjectAssignment.entity';
import { OKRAssignment } from './OKRAssignment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  id: number;

  @Column({ unique: true })
  @ApiProperty({
    description: '사용자 이름',
    example: 'John Doe',
  })
  username: string;

  @Column({ unique: true })
  @ApiProperty({
    description: '사용자 이메일',
    example: 'john.doe@example.com',
  })
  email: string;

  @Column({ name: 'is_verified', default: false })
  @ApiProperty({
    description: '이메일 인증 여부',
    example: false,
  })
  isVerified: boolean;

  // 비밀번호 필드 추가 (ERD에는 없지만 필요)
  @Column({ select: false })
  @ApiProperty({
    description: '사용자 비밀번호',
    example: '********',
  })
  password: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @OneToMany(() => ProjectAssignment, (assignment) => assignment.user)
  projectAssignments: ProjectAssignment[];

  @OneToMany(() => OKRAssignment, (assignment) => assignment.user)
  okrAssignments: OKRAssignment[];
}
