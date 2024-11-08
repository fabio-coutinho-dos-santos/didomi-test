import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersSchema } from './users.schema';

@Entity('events')
export class EventsSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  user_id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'boolean', nullable: false })
  enabled: string;

  @CreateDateColumn({ default: 'now()' })
  created_at: Date;

  @UpdateDateColumn({ default: 'now()' })
  updated_at: Date;

  @ManyToOne(() => UsersSchema, (user) => user.events)
  @JoinColumn({ name: 'user_id' })
  user: UsersSchema;
}
