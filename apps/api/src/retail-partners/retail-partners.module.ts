import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { AdminRetailPartnersController } from './admin-retail-partners.controller';
import { PublicRetailPartnersController } from './public-retail-partners.controller';
import { RetailPartnersService } from './retail-partners.service';

@Module({
  imports: [MediaModule],
  controllers: [AdminRetailPartnersController, PublicRetailPartnersController],
  providers: [RetailPartnersService],
})
export class RetailPartnersModule {}
