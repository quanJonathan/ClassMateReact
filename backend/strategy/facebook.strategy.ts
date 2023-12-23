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
      profileFields: ['emails', 'name', 'photos'],
      passReqToCallback: true
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
    // console.log(profile)
    const facebookUser: IFaceBookUser = {
      provider: authTypeEnum.facebook,
      firstName:
        profile.name && profile.name.givenName ? profile.name.givenName : '',
      lastName:
        profile.name && profile.name.familyName ? profile.name.familyName : '',
      email:
        profile.emails &&
        profile.emails.length > 0 &&
        profile.emails[0].value !== undefined
          ? profile.emails[0].value
          : null,
      photo:
        profile.photos &&
        profile.photos.length > 0 &&
        profile.photos[0].value !== undefined
          ? profile.photos[0].value
          : null,
      providerId: '',
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    // console.log(profile.emails)
    // console.log(profile.name)

    // console.log(facebookUser);

    const user = await this.authService.facebookUserValidate(facebookUser);

    return {
      ...user,
      ...facebookUser,
    };
  }
}
