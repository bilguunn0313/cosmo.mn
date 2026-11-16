import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SlidesService } from './slides.service';

@ApiTags('Public / Slides')
@Controller('public/slides')
export class PublicSlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  @Get()
  findActive() {
    return this.slidesService.findActive();
  }
}
