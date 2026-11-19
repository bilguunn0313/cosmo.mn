import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { AdminJobsController } from './admin-jobs.controller';
import { JobApplicationsService } from './job-applications.service';
import { JobsService } from './jobs.service';
import { PublicJobsController } from './public-jobs.controller';

@Module({
  imports: [MailModule],
  controllers: [AdminJobsController, PublicJobsController],
  providers: [JobsService, JobApplicationsService],
})
export class JobsModule {}
