import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../../entities/attendance.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private notificationService: NotificationService,
  ) {}

  async markAttendance(
    groupId: string,
    studentId: string,
    date: Date,
    isPresent: boolean,
  ): Promise<Attendance> {
    let attendance = await this.attendanceRepository.findOne({
      where: { groupId, studentId, date },
    });

    if (attendance) {
      attendance.isPresent = isPresent;
    } else {
      attendance = this.attendanceRepository.create({
        groupId,
        studentId,
        date,
        isPresent,
      });
    }

    const saved = await this.attendanceRepository.save(attendance);

    // Send notification if absent
    if (!isPresent && !saved.notificationSent) {
      await this.notificationService.sendAbsenceNotification(
        studentId,
        groupId,
        date,
      );
      saved.notificationSent = true;
      await this.attendanceRepository.save(saved);
    }

    return saved;
  }

  async getAttendance(groupId: string, date?: Date) {
    const where: any = { groupId };
    if (date) where.date = date;

    return this.attendanceRepository.find({
      where,
      relations: ['student', 'group'],
    });
  }
}
