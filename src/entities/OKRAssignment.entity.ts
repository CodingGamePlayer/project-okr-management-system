import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User.entity';
import { OKR } from './OKR.entity';

@Entity('okr_assignments')
export class OKRAssignment {
  @PrimaryColumn()
  okr_id: number;

  @PrimaryColumn()
  user_id: number;

  @ManyToOne(() => OKR, (okr) => okr.assignments)
  @JoinColumn({ name: 'okr_id' })
  okr: OKR;

  @ManyToOne(() => User, (user) => user.okrAssignments)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
