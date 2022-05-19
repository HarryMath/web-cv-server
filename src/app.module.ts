import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { Profile } from './profiles/profile';
import { EducationModule } from './education/education.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.prod', '.env.template'],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '80'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      keepConnectionAlive: false,
      synchronize: false,
      dropSchema: false,
      retryAttempts: 1,
      retryDelay: 5000,
      entities: [Profile],
      extra: {
        connectionLimit: 3
      }
    }),
    ProfilesModule,
    AuthModule,
    MailModule,
    EducationModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
