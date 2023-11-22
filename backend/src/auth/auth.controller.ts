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
import { GoogleOAuthGuard } from 'guards/google-oauth.guard';
import { AuthService } from './auth.service';
import { Public } from 'guards/public.guard';
import { User } from 'model/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req) {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Public()
  @Post('signUp')
  async Signup(@Res() response, @Body() user: User) {
    const newUSer = this.authService.localSignUp(user);
    return response.status(HttpStatus.CREATED).json({
      newUSer,
    });
  }

  @Public()
  @Post('signIn')
  async SignIn(@Res() response, @Body() user: User) {
    console.log('signin');
    const fullData = await this.authService.localLogin(user);
    console.log(fullData);
    return response.status(HttpStatus.OK).json(fullData);
  }
}
