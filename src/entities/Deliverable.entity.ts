import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DeliverableAssignment } from './DeliverableAssignment.entity';

@Entity('deliverables')
export class Deliverable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  file_path: string;

  @Column({ nullable: true })
  link: string;

  @OneToMany(() => DeliverableAssignment, (assignment) => assignment.deliverable)
  assignments: DeliverableAssignment[];
}
