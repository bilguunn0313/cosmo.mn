import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { AdminBrandProductsController } from './admin-brand-products.controller';
import { AdminBrandSectionsController } from './admin-brand-sections.controller';
import { AdminBrandsController } from './admin-brands.controller';
import { BrandProductsService } from './brand-products.service';
import { BrandSectionsService } from './brand-sections.service';
import { BrandsService } from './brands.service';
import { PublicBrandsController } from './public-brands.controller';
import { PublicOriginCountriesController } from './public-origin-countries.controller';

@Module({
  imports: [MediaModule],
  controllers: [
    AdminBrandsController,
    AdminBrandSectionsController,
    AdminBrandProductsController,
    PublicBrandsController,
    PublicOriginCountriesController,
  ],
  providers: [BrandsService, BrandSectionsService, BrandProductsService],
})
export class BrandsModule {}
