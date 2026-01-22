import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Exam } from './exam.entity';

@Entity('exam_results')
export class ExamResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  examId: string;

  @ManyToOne(() => Exam, (exam) => exam.results)
  @JoinColumn({ name: 'examId' })
  exam: Exam;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => User, (user) => user.examResults)
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Column({ type: 'json' })
  answers: Record<string, number>;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'int' })
  totalPoints: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;

  @Column({ default: false })
  isPassed: boolean;

  @Column({ type: 'uuid', nullable: true })
  transactionId: string;

  @CreateDateColumn()
  createdAt: Date;
}
