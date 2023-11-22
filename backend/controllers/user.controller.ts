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
import { UserService } from '../service/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'model/user.schema';
import { Public } from 'guards/public.guard';

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  
  @Public()
  @Post('signUp')
  async Signup(@Res() response, @Body() user: User) {
    const newUSer = this.userService.signup(user);
    return response.status(HttpStatus.CREATED).json({
      newUSer,
    });
  }

  @Public()
  @Post('signIn')
  async SignIn(@Res() response, @Body() user: User) {
    const fullData = await this.userService.signin(user, this.jwtService);
    console.log(fullData)
    return response.status(HttpStatus.OK).json(fullData);
  }

  @Post('profile/update')
  async updateData(@Res() response, @Body() user: User){
    const result = await this.userService.update(user)
    console.log(result)
    const u = await this.userService.getOne(user.email)
    console.log(u)
    return response.status(HttpStatus.ACCEPTED).json(result)
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
