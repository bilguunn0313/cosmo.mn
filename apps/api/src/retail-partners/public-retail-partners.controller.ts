import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RetailPartnersService } from './retail-partners.service';

@ApiTags('Public / Retail partners')
@Controller('public/retail-partners')
export class PublicRetailPartnersController {
  constructor(private readonly retailPartnersService: RetailPartnersService) {}

  @Get()
  findVisible() {
    return this.retailPartnersService.findVisible();
  }
}
