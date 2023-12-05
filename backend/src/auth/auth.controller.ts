import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  Query,
  UnauthorizedException,
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

import { EmailConfirmationService } from 'src/email/emailConfirmation.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private emailConfirmationService: EmailConfirmationService,
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
      `https://classmatefe-authentication.onrender.com/google-oauth-success-redirect/${auth.accessToken}/${auth.refreshToken}${req.params.from}`,
    );
  }

  @Get('facebook')
  @UseGuards(FacebookOAuthGuard)
  async facebookAuth(@Req() req: Request) {}

  @Get('facebook-redirect')
  @UseGuards(FacebookOAuthGuard)
  async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
    // console.log(req.user);
    console.log(req);
    const auth = await this.authService.login(req.user as User);
    console.log('from ' + req.params.from);
    console.log('accessToken of facebook ' + auth.accessToken);
    console.log('refreshToken ' + auth.refreshToken);
    res.redirect(
      `https://classmatefe-authentication.onrender.com/facebook-oauth-success-redirect/${auth.accessToken}/${auth.refreshToken}${req.params.from}`,
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
      token: newUSer,
      email: user.email
    });
  }

  @Post('signIn')
  @UseGuards(LocalAuthGuard)
  async SignIn(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('forgot-password')
  async ForgotPassword(@Res() response, @Body() body: { email: string }) {
    const user = await this.authService.checkUserExist(body.email);

    if (user) {
      console.log(user);
      const sendEmail =
        await this.emailConfirmationService.sendResetPasswordLink(user);
      if (sendEmail) {
        return response.status(HttpStatus.ACCEPTED).json({
          sendEmail,
        });
      }
    }
  }

  @Post('reset-password')
  async ResetPassword(
    @Res() response,
    @Body() body: { password: string; token: string },
  ) {
    if (body.token) {
      const email = await this.emailConfirmationService.decodeConfirmationToken(
        body.token,
      );
      const user = await this.authService.checkUserExist(email);
      if (user) {
        const result = await this.userService.updatePassword(
          email,
          body.password,
        );
        if (result){
          return response.status(HttpStatus.ACCEPTED).json({
            statusCode: "202",
            message: "Reset Password Successfully!"
          });
        }
      }
    }
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
