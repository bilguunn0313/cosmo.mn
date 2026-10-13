import { Module } from '@nestjs/common';
import { AdminMilestonesController } from './admin-milestones.controller';
import { MilestonesService } from './milestones.service';
import { PublicMilestonesController } from './public-milestones.controller';

@Module({
  controllers: [AdminMilestonesController, PublicMilestonesController],
  providers: [MilestonesService],
})
export class MilestonesModule {}
