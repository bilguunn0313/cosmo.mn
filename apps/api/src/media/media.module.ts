import { Module } from '@nestjs/common';
import { AdminMediaController } from './admin-media.controller';
import { MediaUsageService } from './media-usage.service';
import { MediaService } from './media.service';
import { StorageService } from './storage.service';

@Module({
  controllers: [AdminMediaController],
  providers: [MediaService, MediaUsageService, StorageService],
})
export class MediaModule {}
