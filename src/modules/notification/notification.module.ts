import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { NotificationService } from './notification.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([User])],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
