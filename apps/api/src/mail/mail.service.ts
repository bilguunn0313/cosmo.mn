import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export interface MailMessage {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}

const DEFAULT_FROM = 'cosmo.mn <onboarding@resend.dev>';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend | null;
  private readonly from: string;
  private readonly isProduction: boolean;

  constructor(config: ConfigService) {
    const apiKey = config.get<string>('RESEND_API_KEY');

    this.resend = apiKey ? new Resend(apiKey) : null;
    this.from = config.get<string>('MAIL_FROM') || DEFAULT_FROM;
    this.isProduction = config.get<string>('NODE_ENV') === 'production';
  }

  async send(message: MailMessage) {
    if (!this.resend) {
      this.handleMissingApiKey(message);
      return;
    }

    const { error } = await this.resend.emails.send({
      from: this.from,
      ...message,
    });

    if (error) {
      this.logger.error(
        `Имэйл илгээж чадсангүй (${message.to}): ${error.message}`,
      );
      throw new ServiceUnavailableException(
        'Мессеж илгээхэд алдаа гарлаа. Дахин оролдоно уу',
      );
    }
  }

  private handleMissingApiKey(message: MailMessage) {
    if (this.isProduction) {
      this.logger.error('RESEND_API_KEY тохируулаагүй байна');
      throw new ServiceUnavailableException(
        'Мессеж илгээх боломжгүй байна. Дараа дахин оролдоно уу',
      );
    }

    this.logger.warn(
      `RESEND_API_KEY тохируулаагүй тул имэйл илгээгдсэнгүй.\n` +
        `To: ${message.to}\nReply-To: ${message.replyTo ?? '-'}\n` +
        `Subject: ${message.subject}\n\n${message.text}`,
    );
  }
}
