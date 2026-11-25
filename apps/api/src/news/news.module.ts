import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { AdminNewsController } from './admin-news.controller';
import { NewsService } from './news.service';
import { PublicNewsController } from './public-news.controller';

@Module({
  imports: [MediaModule],
  controllers: [AdminNewsController, PublicNewsController],
  providers: [NewsService],
})
export class NewsModule {}
