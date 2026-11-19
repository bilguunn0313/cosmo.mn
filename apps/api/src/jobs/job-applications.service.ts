import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  DEFAULT_LOCALE,
  jobApplicationSchema,
  PHOTO_MIME_TYPES,
} from '@cosmo/shared';
import type { JobApplicationInput } from '@cosmo/shared';
import { pickTranslation } from '../common/pick-translation';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  buildApplicationEmail,
  type ApplicationPhoto,
} from './application-email';
import { openJobsWhere } from './jobs.service';

const applicationPipe = new ZodValidationPipe(jobApplicationSchema);

function parseApplication(data: string | undefined): JobApplicationInput {
  if (!data) {
    throw new BadRequestException('Анкетын мэдээлэл ирсэнгүй');
  }

  let value: unknown;

  try {
    value = JSON.parse(data);
  } catch {
    throw new BadRequestException('Анкетын мэдээлэл буруу байна');
  }

  return applicationPipe.transform(value);
}

function assertPhoto(
  photo: ApplicationPhoto | undefined,
): asserts photo is ApplicationPhoto {
  if (!photo) {
    throw new BadRequestException('Цээж зураг оруулна уу');
  }

  if (!(PHOTO_MIME_TYPES as readonly string[]).includes(photo.mimetype)) {
    throw new BadRequestException('Цээж зураг JPG эсвэл PNG байх ёстой');
  }
}

@Injectable()
export class JobApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async apply(
    slug: string,
    data: string | undefined,
    photo: ApplicationPhoto | undefined,
  ) {
    const input = parseApplication(data);
    assertPhoto(photo);

    const job = await this.prisma.jobPosting.findFirst({
      where: { slug, stage: { not: 'DECIDED' }, ...openJobsWhere(new Date()) },
      include: { translations: true },
    });

    if (!job) {
      throw new NotFoundException('Энэ ажлын байранд анкет авахгүй байна');
    }

    const jobTitle =
      pickTranslation(job.translations, DEFAULT_LOCALE)?.title ?? job.slug;
    const recipient = await this.findRecipient();

    await this.mailService.send(
      buildApplicationEmail(input, jobTitle, photo, recipient),
    );
  }

  private async findRecipient() {
    const setting = await this.prisma.siteSetting.findUnique({
      where: { id: 1 },
    });
    const recipient = setting?.hrEmail ?? setting?.email;

    if (!recipient) {
      throw new ServiceUnavailableException(
        'Анкет хүлээн авах имэйл тохируулаагүй байна',
      );
    }

    return recipient;
  }
}
