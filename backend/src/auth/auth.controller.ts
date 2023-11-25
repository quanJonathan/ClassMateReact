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
import { FacebookOAuthGuard } from 'src/guards/facebook-oauth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get('google/:from')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req: Request) {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    console.log(req.user);
    const auth = await this.authService.login(req.user as User);
    console.log('from ' + req.params.from);
    console.log('accessToken of google ' + auth.accessToken);
    console.log('refreshToken ' + auth.refreshToken);
    res.redirect(
      `https://classmatefe.onrender.com/google-oauth-success-redirect/${auth.accessToken}/${auth.refreshToken}${req.params.from}`,
    );
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req: Request) {}

  @Get('facebook-redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
    console.log(req.user);
    const auth = await this.authService.login(req.user as User);
    console.log('from ' + req.params.from);
    console.log('accessToken of facebook ' + auth.accessToken);
    console.log('refreshToken ' + auth.refreshToken);
    res.redirect(
      `https://classmatefe.onrender.com/facebook-oauth-success-redirect/${auth.accessToken}/${auth.refreshToken}${req.params.from}`,
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
  @UseGuards(RefreshTokenGuard)
  getProfile(@Req() req: Request) {
    //console.log(req.user);
    return req.user;
  }

  @Post('profile/update')
  @UseGuards(RefreshTokenGuard)
  async updateData(@Res() response, @Body() user: User) {
    const result = await this.userService.update(user);
    console.log(result);
    return response.status(HttpStatus.ACCEPTED).json(result);
  }
}
