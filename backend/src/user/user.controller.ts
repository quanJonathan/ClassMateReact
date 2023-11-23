/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './model/user.schema';
import { AccessTokenGuard } from 'src/guards/access-token.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}
  
  
}
