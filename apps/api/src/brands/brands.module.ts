import { Module } from '@nestjs/common';
import { AdminBrandSectionsController } from './admin-brand-sections.controller';
import { AdminBrandsController } from './admin-brands.controller';
import { BrandSectionsService } from './brand-sections.service';
import { BrandsService } from './brands.service';
import { PublicBrandsController } from './public-brands.controller';

@Module({
  controllers: [
    AdminBrandsController,
    AdminBrandSectionsController,
    PublicBrandsController,
  ],
  providers: [BrandsService, BrandSectionsService],
})
export class BrandsModule {}
