import { Module } from '@nestjs/common';
import { AdminMediaController } from './admin-media.controller';
import { MediaService } from './media.service';
import { StorageService } from './storage.service';

@Module({
  controllers: [AdminMediaController],
  providers: [MediaService, StorageService],
})
export class MediaModule {}
