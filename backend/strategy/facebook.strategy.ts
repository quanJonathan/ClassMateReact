/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { AuthService } from 'src/auth/auth.service';
import { authTypeEnum } from 'src/enum/authType.enum';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authService: AuthService,
    protected configService: ConfigService<IconfigServiceFB>,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_ID'),
      clientSecret: configService.get<string>('FACEBOOK_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK_REDIRECT_URL'),
      scope: ['email'],
      profileFields: ['emails', 'name'],
    });
  }

  authenticate(req: any, options: any) {
    if (!options?.state) {
      options = { ...options, state: req.params.from };
    }

    return super.authenticate(req, options);
  }

  async validate(
    req: any, // if passReqToCallback: true then this line is required else this should be cleaned.
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const facebookUser: IFaceBookUser = {
      provider: authTypeEnum.facebook,
      firstName: profile?.name.givenName,
      lastName: profile?.name.familyName,
      email: profile?.emails[0].value,
      photo: profile?.photos[0].value,
      accessToken,
      refreshToken,
      providerId: '',
    };

    console.log(facebookUser.email);

    const user = await this.authService.facebookUserValidate(facebookUser);

    return {
      ...user,
      ...facebookUser,
    };
  }
}
