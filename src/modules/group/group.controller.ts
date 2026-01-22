import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GroupService } from './group.service';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Groups')
@Controller('groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly attendanceService: AttendanceService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  async create(@Request() req, @Body() groupData: any) {
    return this.groupService.create(req.user.userId, groupData);
  }

  @Get()
  async findAll(@Request() req) {
    const teacherId = req.user.role === Role.TEACHER ? req.user.userId : undefined;
    return this.groupService.findAll(teacherId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Post(':id/students')
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  async addStudent(@Param('id') groupId: string, @Body() body: { studentId: string }) {
    return this.groupService.addStudent(groupId, body.studentId);
  }

  @Delete(':id/students/:studentId')
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  async removeStudent(@Param('id') groupId: string, @Param('studentId') studentId: string) {
    return this.groupService.removeStudent(groupId, studentId);
  }

  @Post(':id/attendance')
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  async markAttendance(
    @Param('id') groupId: string,
    @Body() body: { studentId: string; date: string; isPresent: boolean },
  ) {
    return this.attendanceService.markAttendance(
      groupId,
      body.studentId,
      new Date(body.date),
      body.isPresent,
    );
  }

  @Get(':id/attendance')
  async getAttendance(@Param('id') groupId: string) {
    return this.attendanceService.getAttendance(groupId);
  }
}
