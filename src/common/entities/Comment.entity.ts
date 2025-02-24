import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OKR } from './OKR.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  okr_id: number;

  @Column()
  content: string;

  @ManyToOne(() => OKR, (okr) => okr.comments)
  @JoinColumn({ name: 'okr_id' })
  okr: OKR;
}
