import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Exam } from '../../entities/exam.entity';
import { Question } from '../../entities/question.entity';
import { ExamResult } from '../../entities/exam-result.entity';
import { FinanceService } from '../finance/finance.service';
import { TransactionType } from '../../common/enums/transaction-type.enum';

@Injectable()
export class ExamService {
  private platformCommission: number;

  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(ExamResult)
    private examResultRepository: Repository<ExamResult>,
    private financeService: FinanceService,
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {
    this.platformCommission =
      Number(this.configService.get('PLATFORM_COMMISSION')) || 10;
  }

  async create(teacherId: string, examData: any): Promise<Exam> {
    const exam = this.examRepository.create({
      ...examData,
      teacherId,
      platformCommission: (examData.price * this.platformCommission) / 100,
    });
    return this.examRepository.save(exam);
  }

  async findAll(teacherId?: string): Promise<Exam[]> {
    const where = teacherId ? { teacherId } : { isPublished: true };
    return this.examRepository.find({
      where,
      relations: ['teacher', 'questions'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ['teacher', 'questions'],
    });
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }
    return exam;
  }

  async takeExam(studentId: string, examId: string, answers: Record<string, number>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const exam = await this.examRepository.findOne({
        where: { id: examId },
        relations: ['questions'],
      });

      if (!exam) {
        throw new NotFoundException('Exam not found');
      }

      // Check if already taken
      const existingResult = await this.examResultRepository.findOne({
        where: { examId, studentId },
      });
      if (existingResult) {
        throw new BadRequestException('Exam already taken');
      }

      // Charge from wallet
      await this.financeService.withdraw(
        studentId,
        Number(exam.price),
        TransactionType.EXAM_PAYMENT,
        `Payment for exam: ${exam.title}`,
      );

      // Calculate score
      let score = 0;
      exam.questions.forEach((question) => {
        if (answers[question.id] === question.correctAnswer) {
          score += question.points;
        }
      });

      const percentage = (score / exam.totalPoints) * 100;
      const isPassed = percentage >= 60;

      const result = this.examResultRepository.create({
        examId,
        studentId,
        answers,
        score,
        totalPoints: exam.totalPoints,
        percentage,
        isPassed,
      });

      await this.examResultRepository.save(result);
      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getResults(examId?: string, studentId?: string) {
    const where: any = {};
    if (examId) where.examId = examId;
    if (studentId) where.studentId = studentId;

    return this.examResultRepository.find({
      where,
      relations: ['exam', 'student'],
      order: { createdAt: 'DESC' },
    });
  }

  async getMyResults(studentId: string) {
    return this.examResultRepository.find({
      where: { studentId },
      relations: ['exam'],
      order: { createdAt: 'DESC' },
    });
  }
}
