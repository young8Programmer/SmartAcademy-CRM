import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Finance')
@Controller('finance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('wallet')
  async getWallet(@Request() req) {
    return this.financeService.getWallet(req.user.userId);
  }

  @Post('deposit')
  async deposit(@Request() req, @Body() body: { amount: number; paymentId?: string }) {
    return this.financeService.deposit(req.user.userId, body.amount, body.paymentId);
  }

  @Get('transactions')
  async getTransactions(@Request() req) {
    return this.financeService.getTransactions(req.user.userId);
  }
}
