import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from '../../entities/exam.entity';
import { Question } from '../../entities/question.entity';
import { ExamResult } from '../../entities/exam-result.entity';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { FinanceModule } from '../finance/finance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exam, Question, ExamResult]),
    FinanceModule,
  ],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamModule {}
