import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from './User.entity';
import { OKR } from './OKR.entity';
import { OKRAssignmentRole } from '../../domain/okr/dto/create-okr-assignment.dto';

@Entity('okr_assignments')
export class OKRAssignment {
  @PrimaryColumn()
  okr_id: number;

  @PrimaryColumn()
  user_id: number;

  @Column({
    type: 'enum',
    enum: OKRAssignmentRole,
    default: OKRAssignmentRole.MEMBER,
  })
  role: OKRAssignmentRole;

  @ManyToOne(() => OKR, (okr) => okr.assignments)
  @JoinColumn({ name: 'okr_id' })
  okr: OKR;

  @ManyToOne(() => User, (user) => user.okrAssignments)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
