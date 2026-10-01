import { Module } from '@nestjs/common';
import { AdminSectionsController } from './admin-sections.controller';
import { PublicSectionsController } from './public-sections.controller';
import { SectionsService } from './sections.service';

@Module({
  controllers: [AdminSectionsController, PublicSectionsController],
  providers: [SectionsService],
})
export class SectionsModule {}
