import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Group } from './group.entity';

@Entity('attendances')
@Unique(['groupId', 'studentId', 'date'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  groupId: string;

  @ManyToOne(() => Group, (group) => group.attendances)
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => User, (user) => user.attendances)
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Column({ type: 'date' })
  date: Date;

  @Column({ default: false })
  isPresent: boolean;

  @Column({ default: false })
  notificationSent: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
