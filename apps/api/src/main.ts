import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { configureApp, isSwaggerEnabled, setupSwagger } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  configureApp(app);

  if (isSwaggerEnabled()) {
    setupSwagger(app);
  }

  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
