import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GoogleOAuthGuard } from '../guards/google-oauth.guard';
import { AuthService } from './auth.service';
import { User } from '../user/model/user.schema';
import { Request, Response } from 'express';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { authTypeEnum } from 'src/enum/authType.enum';
import { UserService } from 'src/user/user.service';
import { EmailConfirmationService } from 'src/email/emailConfirmation.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private emailConfirmationService: EmailConfirmationService
  ) {}


  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const auth = await this.authService.googleUserValidate(req.userEntity);

    res.redirect(
      `https://classmatefe.onrender.com/google-oauth-success-redirect/${auth.accessToken}/${auth.refreshToken}${req.params.from}`,
    );
  }

  @Get('logout')
  @UseGuards(AccessTokenGuard)
  logout(@Req() req): Promise<User> {
    return this.authService.logout(
      req.user.email,
      authTypeEnum[req.user.provider],
    );
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  refreshTokens(@Req() req: Request): Promise<IJWTTokensPair | any> {
    const email = req.userEntity.email;
    const provider = req.userEntity.provider;
    const refreshToken = req.userEntity.refreshToken;
    return this.authService.refreshTokens(
      email,
      authTypeEnum[provider],
      refreshToken,
    );
  }

  @Post('signUp')
  async Signup(@Res() response, @Body() user: User) {
    const newUSer = this.authService.localSignUp(user);
    await this.emailConfirmationService.sendVerificationLink(user);
    return response.status(HttpStatus.CREATED).json({
      newUSer,
    });
  }

  @Post('signIn')
  @UseGuards(LocalAuthGuard)
  async SignIn(@Req() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @UseGuards(AccessTokenGuard)
  getProfile(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }

  @Post('profile/update')
  @UseGuards(AccessTokenGuard)
  async updateData(@Res() response, @Body() user: User) {
    const result = await this.userService.update(user);
    console.log(result);
    const u = await this.userService.getOne(user.email);
    console.log(u);
    return response.status(HttpStatus.ACCEPTED).json(result);
  }
}
