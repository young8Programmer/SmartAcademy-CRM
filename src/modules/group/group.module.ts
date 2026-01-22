import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../../entities/group.entity';
import { GroupStudent } from '../../entities/group-student.entity';
import { Attendance } from '../../entities/attendance.entity';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { AttendanceService } from './attendance.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, GroupStudent, Attendance]),
    NotificationModule,
  ],
  controllers: [GroupController],
  providers: [GroupService, AttendanceService],
  exports: [GroupService, AttendanceService],
})
export class GroupModule {}
