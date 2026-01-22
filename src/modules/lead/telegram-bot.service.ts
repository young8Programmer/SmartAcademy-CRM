import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { LeadService } from './lead.service';

@Injectable()
export class TelegramBotService implements OnModuleInit {
  private bot: Telegraf;

  constructor(
    private configService: ConfigService,
    private leadService: LeadService,
  ) {}

  onModuleInit() {
    const token = this.configService.get('TELEGRAM_BOT_TOKEN');
    if (token) {
      this.bot = new Telegraf(token);
      this.setupHandlers();
      this.bot.launch();
    }
  }

  private setupHandlers() {
    this.bot.start((ctx) => {
      ctx.reply('Salom! O\'quv markazimizga xush kelibsiz!');
    });

    this.bot.on('contact', async (ctx) => {
      const contact = ctx.message.contact;
      await this.leadService.create({
        firstName: contact.first_name || '',
        lastName: contact.last_name || '',
        phone: contact.phone_number,
        telegramChatId: ctx.chat.id.toString(),
        source: 'telegram',
        metadata: {
          username: ctx.from.username,
          chatId: ctx.chat.id,
        },
      });
      ctx.reply('Rahmat! Tez orada siz bilan bog\'lanamiz.');
    });

    this.bot.on('text', async (ctx) => {
      const text = ctx.message.text;
      if (text.length > 10) {
        await this.leadService.create({
          firstName: ctx.from.first_name || '',
          lastName: ctx.from.last_name || '',
          phone: ctx.from.id.toString(),
          message: text,
          telegramChatId: ctx.chat.id.toString(),
          source: 'telegram',
          metadata: {
            username: ctx.from.username,
            chatId: ctx.chat.id,
          },
        });
        ctx.reply('Xabaringiz qabul qilindi! Tez orada javob beramiz.');
      }
    });
  }
}
