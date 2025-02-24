import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from './User.entity';
import { Project } from './Project.entity';

@Entity('project_assignments')
export class ProjectAssignment {
  @PrimaryColumn()
  project_id: number;

  @PrimaryColumn()
  user_id: number;

  @Column()
  role: string;

  @ManyToOne(() => Project, (project) => project.assignments)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, (user) => user.projectAssignments)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
