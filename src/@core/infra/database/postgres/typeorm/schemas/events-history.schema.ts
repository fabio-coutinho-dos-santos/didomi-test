import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersSchema } from './users.schema';

@Entity('events_history')
export class EventsHistorySchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  user_id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'boolean', nullable: false })
  value: string;

  @CreateDateColumn({ default: 'now()' })
  created_at: Date;

  @ManyToOne(() => UsersSchema, (user) => user.events)
  @JoinColumn({ name: 'user_id' })
  user: UsersSchema;
}
