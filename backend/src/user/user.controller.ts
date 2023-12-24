/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './model/user.schema';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}
  
  @Get('/all')
  async getAll() {
    return await this.userService.findAll();
  }

  @Post('addAccount')
  async Signup(@Res() response, @Body() user: User) {
    const newUSer = this.authService.adminSignUp(user);
    return response.status(HttpStatus.CREATED).json({
      token: newUSer,
      email: user.email
    });
  }
}
