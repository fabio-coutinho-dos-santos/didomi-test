import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventsSchema } from './events.schema';

@Entity('users')
export class UsersSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @CreateDateColumn({ default: 'now()' })
  created_at: Date;

  @UpdateDateColumn({ default: 'now()' })
  updated_at: Date;

  @OneToMany(() => EventsSchema, (event) => event.user)
  events: EventsSchema[];
}
