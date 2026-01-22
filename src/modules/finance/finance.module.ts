import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../../entities/wallet.entity';
import { Transaction } from '../../entities/transaction.entity';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { AutoBillingService } from './auto-billing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  controllers: [FinanceController],
  providers: [FinanceService, AutoBillingService],
  exports: [FinanceService],
})
export class FinanceModule {}
