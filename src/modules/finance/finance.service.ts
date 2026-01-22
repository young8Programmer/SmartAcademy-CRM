import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from '../../entities/wallet.entity';
import { Transaction } from '../../entities/transaction.entity';
import { TransactionType } from '../../common/enums/transaction-type.enum';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private dataSource: DataSource,
  ) {}

  async getWallet(userId: string): Promise<Wallet> {
    return this.walletRepository.findOne({ where: { userId } });
  }

  async deposit(userId: string, amount: number, paymentId?: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { userId },
      });

      if (!wallet) {
        throw new BadRequestException('Wallet not found');
      }

      const balanceBefore = Number(wallet.balance);
      const balanceAfter = balanceBefore + amount;

      await queryRunner.manager.update(Wallet, wallet.id, {
        balance: balanceAfter,
      });

      const transaction = queryRunner.manager.create(Transaction, {
        userId,
        walletId: wallet.id,
        type: TransactionType.DEPOSIT,
        amount,
        balanceBefore,
        balanceAfter,
        paymentId,
        status: 'completed',
      });

      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      return { wallet, transaction };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async withdraw(
    userId: string,
    amount: number,
    type: TransactionType,
    description?: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { userId },
      });

      if (!wallet) {
        throw new BadRequestException('Wallet not found');
      }

      const balanceBefore = Number(wallet.balance);
      if (balanceBefore < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const balanceAfter = balanceBefore - amount;

      await queryRunner.manager.update(Wallet, wallet.id, {
        balance: balanceAfter,
      });

      const transaction = queryRunner.manager.create(Transaction, {
        userId,
        walletId: wallet.id,
        type,
        amount,
        balanceBefore,
        balanceAfter,
        description,
        status: 'completed',
      });

      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      return { wallet, transaction };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getTransactions(userId: string) {
    return this.transactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
