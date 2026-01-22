import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmConfigService } from './config/database.config';
import { UserModule } from './modules/user/user.module';
import { FinanceModule } from './modules/finance/finance.module';
import { ExamModule } from './modules/exam/exam.module';
import { GroupModule } from './modules/group/group.module';
import { LeadModule } from './modules/lead/lead.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    FinanceModule,
    ExamModule,
    GroupModule,
    LeadModule,
    NotificationModule,
  ],
})
export class AppModule {}
