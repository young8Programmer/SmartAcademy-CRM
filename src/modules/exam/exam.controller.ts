import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Exams')
@Controller('exams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  async create(@Request() req, @Body() examData: any) {
    return this.examService.create(req.user.userId, examData);
  }

  @Get()
  async findAll(@Request() req) {
    const teacherId = req.user.role === Role.TEACHER ? req.user.userId : undefined;
    return this.examService.findAll(teacherId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.examService.findOne(id);
  }

  @Post(':id/take')
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  async takeExam(
    @Request() req,
    @Param('id') examId: string,
    @Body() body: { answers: Record<string, number> },
  ) {
    return this.examService.takeExam(req.user.userId, examId, body.answers);
  }

  @Get(':id/results')
  async getResults(@Param('id') examId: string) {
    return this.examService.getResults(examId);
  }

  @Get('results/my')
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  async getMyResults(@Request() req) {
    return this.examService.getMyResults(req.user.userId);
  }
}
