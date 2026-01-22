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

@Entity('group_students')
@Unique(['groupId', 'studentId'])
export class GroupStudent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  groupId: string;

  @ManyToOne(() => Group, (group) => group.students)
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => User, (user) => user.groupStudents)
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  enrolledAt: Date;
}
