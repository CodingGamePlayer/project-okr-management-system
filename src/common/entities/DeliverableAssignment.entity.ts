import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Deliverable } from './Deliverable.entity';
import { OKR } from './OKR.entity';
import { Project } from './Project.entity';

@Entity('deliverable_assignments')
@Index(['deliverable_id', 'okr_id'], { unique: true, where: 'okr_id IS NOT NULL' })
@Index(['deliverable_id', 'project_id'], { unique: true, where: 'project_id IS NOT NULL' })
export class DeliverableAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deliverable_id: number;

  @Column({ nullable: true })
  okr_id: number;

  @Column({ nullable: true })
  project_id: number;

  @ManyToOne(() => Deliverable, (deliverable) => deliverable.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'deliverable_id' })
  deliverable: Deliverable;

  @ManyToOne(() => OKR, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'okr_id' })
  okr: OKR;

  @ManyToOne(() => Project, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
