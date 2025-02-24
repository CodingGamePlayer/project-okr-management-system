import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User.entity';
import { Project } from './Project.entity';
import { OKRAssignment } from './OKRAssignment.entity';
import { OKRKeyResult } from './OKRKeyResult.entity';
import { Comment } from './Comment.entity';

@Entity('okrs')
export class OKR {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  parent_id: number;

  @Column()
  project_id: number;

  @Column()
  manager_id: number;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column('float')
  progress: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'manager_id' })
  manager: User;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => OKR, (okr) => okr.children)
  @JoinColumn({ name: 'parent_id' })
  parent: OKR;

  @OneToMany(() => OKR, (okr) => okr.parent)
  children: OKR[];

  @OneToMany(() => OKRAssignment, (assignment) => assignment.okr)
  assignments: OKRAssignment[];

  @OneToMany(() => OKRKeyResult, (keyResult) => keyResult.okr)
  keyResults: OKRKeyResult[];

  @OneToMany(() => Comment, (comment) => comment.okr)
  comments: Comment[];
}
