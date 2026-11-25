import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { AdminMilestonesController } from './admin-milestones.controller';
import { MilestonesService } from './milestones.service';
import { PublicMilestonesController } from './public-milestones.controller';

@Module({
  imports: [MediaModule],
  controllers: [AdminMilestonesController, PublicMilestonesController],
  providers: [MilestonesService],
})
export class MilestonesModule {}
