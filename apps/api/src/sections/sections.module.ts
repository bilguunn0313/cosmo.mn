import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { AdminSectionsController } from './admin-sections.controller';
import { PublicSectionsController } from './public-sections.controller';
import { SectionsService } from './sections.service';

@Module({
  imports: [MediaModule],
  controllers: [AdminSectionsController, PublicSectionsController],
  providers: [SectionsService],
})
export class SectionsModule {}
