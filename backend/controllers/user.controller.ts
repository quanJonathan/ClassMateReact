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
import { User } from 'model/user.schema';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}
  
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
