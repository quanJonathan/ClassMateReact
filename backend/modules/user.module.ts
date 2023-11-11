import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from 'controllers/user.controller';
import { User, UserSchema } from 'model/user.schema';
import { UserService } from 'service/user.service';

@Module({
  imports: [
    ,

  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
