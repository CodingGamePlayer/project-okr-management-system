import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Deliverable } from './Deliverable.entity';
import { OKR } from './OKR.entity';
import { Project } from './Project.entity';

@Entity('deliverable_assignments')
export class DeliverableAssignment {
  @PrimaryColumn()
  deliverable_id: number;

  @Column({ nullable: true })
  okr_id: number;

  @Column({ nullable: true })
  project_id: number;

  @ManyToOne(() => Deliverable, (deliverable) => deliverable.assignments)
  @JoinColumn({ name: 'deliverable_id' })
  deliverable: Deliverable;

  @ManyToOne(() => OKR)
  @JoinColumn({ name: 'okr_id' })
  okr: OKR;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
