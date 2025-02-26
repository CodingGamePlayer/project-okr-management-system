import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Role } from './Role.entity';
import { ProjectAssignment } from './ProjectAssignment.entity';
import { OKRAssignment } from './OKRAssignment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  // 비밀번호 필드 추가 (ERD에는 없지만 필요)
  @Column({ select: false })
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
