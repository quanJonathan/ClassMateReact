/* eslint-disable prettier/prettier */
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { authTypeEnum } from 'src/enum/authType.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    protected configService: ConfigService<IconfigService>
    ) {
    super({
      clientID: configService.get<string>('OAUTH_GOOGLE_ID'),
      clientSecret: configService.get<string>('OAUTH_GOOGLE_SECRET'),
      callbackURL: configService.get<string>('OAUTH_GOOGLE_REDIRECT_URL'),
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  authenticate(req: any, options: any) {

    if (!options?.state) {
      options = { ...options, state: req.params.from }
    } 
    
    return super.authenticate(req, options)
  }

  async validate(
    req: any, // if passReqToCallback: true then this line is required else this should be cleaned.
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const googleUser: IGoogleUser = {
      provider: authTypeEnum.google,
      firstName: profile?.name.givenName,
      lastName: profile?.name.familyName,
      email: profile?.emails[0].value,
      photo: profile?.photos[0].value,
      accessToken,
      refreshToken,
      providerId: ''
    };

    console.log(googleUser.email)

    const user = await this.authService.googleUserValidate(googleUser);

    return {
      ...user,
      ...googleUser,
    };
  }
}
