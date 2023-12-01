import { Module } from '@nestjs/common';
import EmailService from './email.service';
import { ConfigModule } from '@nestjs/config';
import { EmailConfirmationController } from './emailConfirmation.controller';
import { EmailConfirmationService } from './emailConfirmation.service';
import { UsersModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, UsersModule, JwtModule.register({})],
  controllers: [EmailConfirmationController],
  providers: [EmailService, EmailConfirmationService],
})
export class EmailModule {}
