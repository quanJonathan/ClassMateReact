/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './model/user.schema';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { AuthService } from 'src/auth/auth.service';
import { userStateEnum } from 'src/enum/userState.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) { }

  @Get('/all')
  async getAll() {
    return await this.userService.findAll();
  }

  @Get('get/:accountId')
  async getOneById(@Param() params: any) {
    console.log(params)
    return await this.userService.findOneById(params.accountId);
  }

  @Post('addAccount')
  async Signup(@Res() response, @Body() user: User) {
    await this.authService.adminSignUp(user).then((newUSer) => {
      // console.log(newUSer[0])
      if (newUSer === 'error') {
        console.log('FAIL TO CREATE' + (user.email ? user.email : user.studentId))
        return response.status(HttpStatus.BAD_REQUEST).json({
          token: newUSer,
          email: user.email
        });
      }
      return response.status(HttpStatus.CREATED).json({
        token: newUSer,
        email: user.email
      });
    });
  }

  @Post('ban')
  async BanAccount(@Res() response, @Body() user) {
    console.log(user.email)
    let newUSer = await this.userService.findOneById(user.email);
    if (newUSer) {
      let user = newUSer;
      // console.log(user)
      if (user.state && user.state !== userStateEnum.banned)
        {
          console.log("ban")
          this.userService.updateState(user, userStateEnum.banned);
        }
      else
        this.userService.updateState(user, userStateEnum.activated);
      return response.status(HttpStatus.OK).json({

      });
    }
    return response.status(HttpStatus.BAD_REQUEST).json({

    });
  }

  @Post('remove')
  async RemoveAccount(@Res() response, @Body() id) {
    console.log('removing' + id)
    const newUSer = await this.userService.remove(id.id);
    return response.status(HttpStatus.OK).json({

    });
  }

  @Post('update')
  async updateData(@Res() response, @Body() user) {
    const result = await this.userService.adminUpdate(user);
    console.log(result);
    if(result)
      {return response.status(HttpStatus.OK).json(result);
      }
    return response.status(HttpStatus.BAD_REQUEST).json();
  }

  @Post('mapIdWithEmail')
  async MapStudentId(@Res() response, @Body() user) {
    const result = await this.userService.updateStudentId(user);
    console.log(result);
    if(result)
      {return response.status(HttpStatus.OK).json(result);
      }
    return response.status(HttpStatus.BAD_REQUEST).json();
  }
}
