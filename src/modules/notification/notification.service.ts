import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async sendSMS(phone: string, message: string): Promise<void> {
    const apiKey = this.configService.get('SMS_API_KEY');
    const apiUrl = this.configService.get('SMS_API_URL');

    if (!apiKey || !apiUrl) {
      console.log(`SMS would be sent to ${phone}: ${message}`);
      return;
    }

    try {
      await firstValueFrom(
        this.httpService.post(apiUrl, {
          phone,
          message,
          api_key: apiKey,
        }),
      );
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  }

  async sendTelegramMessage(chatId: string, message: string): Promise<void> {
    const botToken = this.configService.get('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      console.log(`Telegram would be sent to ${chatId}: ${message}`);
      return;
    }

    try {
      await firstValueFrom(
        this.httpService.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          chat_id: chatId,
          text: message,
        }),
      );
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
    }
  }

  async sendAbsenceNotification(
    studentId: string,
    groupId: string,
    date: Date,
  ): Promise<void> {
    const student = await this.userRepository.findOne({
      where: { id: studentId },
    });

    if (!student || !student.phone) {
      return;
    }

    const message = `Hurmatli ota-ona! ${student.firstName} ${student.lastName} ${date.toLocaleDateString('uz-UZ')} sanasida darsga kelmadi.`;

    // Send SMS
    if (student.phone) {
      await this.sendSMS(student.phone, message);
    }

    // Send Telegram if available
    if (student.telegramId) {
      await this.sendTelegramMessage(student.telegramId, message);
    }
  }
}
