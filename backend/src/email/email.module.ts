import { Module } from '@nestjs/common';
import EmailService from './email.service';
import { ConfigModule } from '@nestjs/config';
import { EmailConfirmationController } from './emailConfirmation.controller';
import { EmailConfirmationService } from './emailConfirmation.service';
import { UsersModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ClassService } from 'src/services/class.service';
import { ClassesModule } from 'src/modules/class.module';

@Module({
  imports: [ConfigModule, UsersModule, JwtModule.register({}), ClassesModule],
  controllers: [EmailConfirmationController],
  providers: [EmailService, EmailConfirmationService],
})
export class EmailModule {}
