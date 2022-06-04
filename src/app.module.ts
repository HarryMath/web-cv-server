import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { Profile } from './profiles/profile';
import { EducationModule } from './education/education.module';
import { Education } from './education/education';
import { SkillsModule } from './skills/skills.module';
import { Skill } from './skills/skill';
import { ExperiencesModule } from './experiences/experiences.module';
import { Visitor } from './profiles/visitor';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/jwt.guard';
import { Experience } from './experiences/experience';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
      synchronize: true,
      dropSchema: false,
      retryAttempts: 1,
      retryDelay: 5000,
      entities: [Profile, Education, Skill, Experience, Visitor],
      extra: {
        connectionLimit: 3
      }
    }),
    ProfilesModule,
    AuthModule,
    MailModule,
    EducationModule,
    SkillsModule,
    ExperiencesModule,
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtGuard
  }]
})
export class AppModule {}
