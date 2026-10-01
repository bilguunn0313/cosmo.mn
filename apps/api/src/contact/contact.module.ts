import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { AdminContactDepartmentsController } from './admin-contact-departments.controller';
import { ContactDepartmentsService } from './contact-departments.service';
import { ContactService } from './contact.service';
import { PublicContactController } from './public-contact.controller';

@Module({
  imports: [MailModule],
  controllers: [AdminContactDepartmentsController, PublicContactController],
  providers: [ContactService, ContactDepartmentsService],
})
export class ContactModule {}
