import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DeliverableAssignment } from './DeliverableAssignment.entity';
import { User } from './User.entity';

export enum DeliverableType {
  FILE = 'FILE',
  LINK = 'LINK',
}

@Entity('deliverables')
export class Deliverable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: DeliverableType,
  })
  type: DeliverableType;

  @Column({ nullable: true })
  file_path: string;

  @Column({ nullable: true })
  link: string;

  @Column()
  creator_id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => DeliverableAssignment, (assignment) => assignment.deliverable)
  assignments: DeliverableAssignment[];
}
