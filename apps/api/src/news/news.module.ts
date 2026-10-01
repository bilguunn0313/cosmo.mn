import { Module } from '@nestjs/common';
import { AdminNewsController } from './admin-news.controller';
import { NewsService } from './news.service';
import { PublicNewsController } from './public-news.controller';

@Module({
  controllers: [AdminNewsController, PublicNewsController],
  providers: [NewsService],
})
export class NewsModule {}
