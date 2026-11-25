import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { AdminSlidesController } from './admin-slides.controller';
import { PublicSlidesController } from './public-slides.controller';
import { SlidesService } from './slides.service';

@Module({
  imports: [MediaModule],
  controllers: [AdminSlidesController, PublicSlidesController],
  providers: [SlidesService],
})
export class SlidesModule {}
