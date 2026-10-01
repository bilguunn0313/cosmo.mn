import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { DEFAULT_LOCALE } from '@cosmo/shared';
import type { ContactInput } from '@cosmo/shared';
import { pickTranslation } from '../common/pick-translation';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { buildContactEmail } from './contact-email';

const GENERAL_RECIPIENT_NAME = 'Ерөнхий';

interface Recipient {
  name: string;
  email: string;
}

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async send(input: ContactInput) {
    const recipient =
      (await this.findDepartmentRecipient(input.departmentId)) ??
      (await this.findGeneralRecipient());

    await this.mailService.send(buildContactEmail(input, recipient));
  }

  private async findDepartmentRecipient(
    departmentId: number | undefined,
  ): Promise<Recipient | null> {
    if (departmentId === undefined) {
      return null;
    }

    const department = await this.prisma.contactDepartment.findFirst({
      where: { id: departmentId, isActive: true },
      include: { translations: true },
    });

    if (!department) {
      return null;
    }

    return {
      name: pickTranslation(department.translations, DEFAULT_LOCALE)?.name ?? '',
      email: department.email,
    };
  }

  private async findGeneralRecipient(): Promise<Recipient> {
    const setting = await this.prisma.siteSetting.findUnique({
      where: { id: 1 },
    });

    if (!setting?.email) {
      throw new ServiceUnavailableException(
        'Мессеж хүлээн авах имэйл тохируулаагүй байна',
      );
    }

    return { name: GENERAL_RECIPIENT_NAME, email: setting.email };
  }
}
