import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BrandsService } from './brands.service';

@ApiTags('Public / Brands')
@Controller('public/origin-countries')
export class PublicOriginCountriesController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  findAll() {
    return this.brandsService.findOriginCountries();
  }
}
