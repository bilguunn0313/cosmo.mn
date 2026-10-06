import { Module } from '@nestjs/common';
import { AdminBrandProductsController } from './admin-brand-products.controller';
import { AdminBrandSectionsController } from './admin-brand-sections.controller';
import { AdminBrandsController } from './admin-brands.controller';
import { BrandProductsService } from './brand-products.service';
import { BrandSectionsService } from './brand-sections.service';
import { BrandsService } from './brands.service';
import { PublicBrandsController } from './public-brands.controller';

@Module({
  controllers: [
    AdminBrandsController,
    AdminBrandSectionsController,
    AdminBrandProductsController,
    PublicBrandsController,
  ],
  providers: [BrandsService, BrandSectionsService, BrandProductsService],
})
export class BrandsModule {}
