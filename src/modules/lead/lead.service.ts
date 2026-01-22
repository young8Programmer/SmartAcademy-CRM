import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../../entities/lead.entity';
import { LeadStatus } from '../../common/enums/lead-status.enum';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  async create(leadData: any): Promise<Lead> {
    const lead = this.leadRepository.create(leadData);
    return this.leadRepository.save(lead);
  }

  async findAll(status?: LeadStatus): Promise<Lead[]> {
    const where = status ? { status } : {};
    return this.leadRepository.find({
      where,
      relations: ['assignedTo'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { id },
      relations: ['assignedTo'],
    });
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }
    return lead;
  }

  async assign(leadId: string, assignedToId: string): Promise<Lead> {
    const lead = await this.findOne(leadId);
    lead.assignedToId = assignedToId;
    lead.status = LeadStatus.CONTACTED;
    return this.leadRepository.save(lead);
  }

  async updateStatus(leadId: string, status: LeadStatus): Promise<Lead> {
    const lead = await this.findOne(leadId);
    lead.status = status;
    return this.leadRepository.save(lead);
  }
}
