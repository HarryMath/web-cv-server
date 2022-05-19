import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<number> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const port = parseInt(process.env.PORT || '80');
  await app.listen(port);
  return port;
}
bootstrap().then((port) => console.log(`application started on port ${port}`));
