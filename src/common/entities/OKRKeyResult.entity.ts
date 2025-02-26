import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OKR } from './OKR.entity';
import { KeyResultUnit } from '../../domain/okr/dto/key-result-unit.enum';

@Entity('okr_key_results')
export class OKRKeyResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  okr_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: KeyResultUnit,
    default: KeyResultUnit.NUMBER,
  })
  unit: KeyResultUnit;

  @Column('float')
  target_value: number;

  @Column('float')
  current_value: number;

  @Column('float')
  weight: number;

  @Column('float')
  progress: number;

  @Column()
  deadline: Date;

  @ManyToOne(() => OKR, (okr) => okr.keyResults)
  @JoinColumn({ name: 'okr_id' })
  okr: OKR;
}
