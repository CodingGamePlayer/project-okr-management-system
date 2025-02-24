import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OKR } from './OKR.entity';

@Entity('okr_key_results')
export class OKRKeyResult {
  @PrimaryColumn()
  okr_id: number;

  @Column('float')
  progress: number;

  @Column()
  deadline: Date;

  @ManyToOne(() => OKR, (okr) => okr.keyResults)
  @JoinColumn({ name: 'okr_id' })
  okr: OKR;
}
