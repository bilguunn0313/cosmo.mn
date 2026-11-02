import { Module } from '@nestjs/common';
import { AdminRetailPartnersController } from './admin-retail-partners.controller';
import { PublicRetailPartnersController } from './public-retail-partners.controller';
import { RetailPartnersService } from './retail-partners.service';

@Module({
  controllers: [AdminRetailPartnersController, PublicRetailPartnersController],
  providers: [RetailPartnersService],
})
export class RetailPartnersModule {}
