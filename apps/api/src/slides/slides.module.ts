import { Module } from '@nestjs/common';
import { AdminSlidesController } from './admin-slides.controller';
import { PublicSlidesController } from './public-slides.controller';
import { SlidesService } from './slides.service';

@Module({
  controllers: [AdminSlidesController, PublicSlidesController],
  providers: [SlidesService],
})
export class SlidesModule {}
