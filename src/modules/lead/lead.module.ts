import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from '../../entities/lead.entity';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { TelegramBotService } from './telegram-bot.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lead])],
  controllers: [LeadController],
  providers: [LeadService, TelegramBotService],
  exports: [LeadService, TelegramBotService],
})
export class LeadModule {}
