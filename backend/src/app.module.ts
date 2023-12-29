/* eslint-disable prettier/prettier */
import {  Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from 'src/user/user.module';
import { EmailConfirmationController } from './email/emailConfirmation.controller';
import EmailService from './email/email.service';
import { EmailConfirmationService } from './email/emailConfirmation.service';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { ClassesModule } from './modules/class.module';
import { ClassController } from './controllers/class.controller';
import { ClassService } from './services/class.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI')
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    EmailModule,
    ClassesModule,
    JwtModule.register({}),
  ],
  controllers: [UserController, EmailConfirmationController, ClassController],
  providers: [AppService, EmailConfirmationService, EmailService],
})
export class AppModule {}
