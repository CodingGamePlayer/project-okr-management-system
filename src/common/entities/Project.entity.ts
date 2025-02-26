import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User.entity';
import { ProjectAssignment } from './ProjectAssignment.entity';
import { OKR } from './OKR.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  parent_id: number;

  @Column({ nullable: true })
  label: string;

  @Column()
  manager_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'manager_id' })
  manager: User;

  @ManyToOne(() => Project, (project) => project.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Project;

  @OneToMany(() => Project, (project) => project.parent)
  children: Project[];

  @OneToMany(() => ProjectAssignment, (assignment) => assignment.project)
  assignments: ProjectAssignment[];

  @OneToMany(() => OKR, (okr) => okr.project)
  okrs: OKR[];
}
