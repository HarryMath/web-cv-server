import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CutBodyPipe } from './cut-body.pipe';

async function bootstrap(): Promise<number> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
    }),
    new CutBodyPipe()
  );
  app.enableCors();
  const port = parseInt(process.env.PORT || '80');
  await app.listen(port);
  return port;
}
bootstrap().then((port) => console.log(`application started on port ${port}`));
