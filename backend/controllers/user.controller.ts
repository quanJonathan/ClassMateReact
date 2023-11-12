/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { User, UserService } from '../service/user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('signUp')
  async Signup(@Res() response, @Body() user: User) {
    const newUSer = this.userService.signup(user);
    console.log("running")
    return response.status(HttpStatus.CREATED).json({
      newUSer,
    });
  }

  @Post('signIn')
  async SignIn(@Res() response, @Body() user: User) {
    const fullData = await this.userService.signin(user, this.jwtService);
    console.log(fullData)
    return response.status(HttpStatus.OK).json(fullData);
  }

  @Get('profile/:email')
  getUserByEmail(@Param('email') email: string){
    const user = this.userService.getOne(email)
    if(user){
      return user; 
    }else{
      throw new NotFoundException('User not found');
    }
  }

}
