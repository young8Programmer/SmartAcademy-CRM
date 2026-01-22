import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../entities/wallet.entity';
import { FinanceService } from './finance.service';
import { TransactionType } from '../../common/enums/transaction-type.enum';

@Injectable()
export class AutoBillingService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private financeService: FinanceService,
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async monthlyBilling() {
    const wallets = await this.walletRepository.find({
      where: { autoBillingEnabled: true },
    });

    for (const wallet of wallets) {
      if (wallet.monthlyFee && wallet.monthlyFee > 0) {
        try {
          await this.financeService.withdraw(
            wallet.userId,
            Number(wallet.monthlyFee),
            TransactionType.AUTO_BILLING,
            'Monthly subscription fee',
          );
        } catch (error) {
          console.error(`Failed to bill user ${wallet.userId}:`, error);
        }
      }
    }
  }
}
