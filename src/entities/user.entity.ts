import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../common/enums/role.enum';
import { Wallet } from './wallet.entity';
import { Transaction } from './transaction.entity';
import { ExamResult } from './exam-result.entity';
import { GroupStudent } from './group-student.entity';
import { Attendance } from './attendance.entity';
import { Lead } from './lead.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column({ nullable: true })
  telegramId: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
  wallet: Wallet;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => ExamResult, (result) => result.student)
  examResults: ExamResult[];

  @OneToMany(() => GroupStudent, (groupStudent) => groupStudent.student)
  groupStudents: GroupStudent[];

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];

  @OneToMany(() => Lead, (lead) => lead.assignedTo)
  assignedLeads: Lead[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
