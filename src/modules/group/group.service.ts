import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../../entities/group.entity';
import { GroupStudent } from '../../entities/group-student.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(GroupStudent)
    private groupStudentRepository: Repository<GroupStudent>,
  ) {}

  async create(teacherId: string, groupData: any): Promise<Group> {
    const group = this.groupRepository.create({
      ...groupData,
      teacherId,
    });
    return this.groupRepository.save(group);
  }

  async findAll(teacherId?: string): Promise<Group[]> {
    const where = teacherId ? { teacherId } : {};
    return this.groupRepository.find({
      where,
      relations: ['teacher', 'students', 'students.student'],
    });
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['teacher', 'students', 'students.student'],
    });
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async addStudent(groupId: string, studentId: string): Promise<GroupStudent> {
    const groupStudent = this.groupStudentRepository.create({
      groupId,
      studentId,
    });
    return this.groupStudentRepository.save(groupStudent);
  }

  async removeStudent(groupId: string, studentId: string): Promise<void> {
    await this.groupStudentRepository.delete({ groupId, studentId });
  }
}
