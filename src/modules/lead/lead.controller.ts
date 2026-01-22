import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LeadService } from './lead.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { LeadStatus } from '../../common/enums/lead-status.enum';

@ApiTags('Leads')
@Controller('leads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.TEACHER)
@ApiBearerAuth()
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get()
  async findAll(@Body() body?: { status?: LeadStatus }) {
    return this.leadService.findAll(body?.status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.leadService.findOne(id);
  }

  @Post()
  async create(@Body() leadData: any) {
    return this.leadService.create(leadData);
  }

  @Patch(':id/assign')
  async assign(@Param('id') id: string, @Body() body: { assignedToId: string }) {
    return this.leadService.assign(id, body.assignedToId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: LeadStatus },
  ) {
    return this.leadService.updateStatus(id, body.status);
  }
}
