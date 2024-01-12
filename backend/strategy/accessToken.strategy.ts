/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from 'src/user/user.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    protected configService: ConfigService<IconfigService>,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //   ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
      usernameField: 'email',
    });
  }

  async validate(payload: IJwtPayload) {
    //console.log(payload);
    if (payload.email && payload.provider) {
      const { password, ...rest } = await this.userService.findOneByEmailAndProvider(
        payload.email, payload.provider
      );
      // console.log(rest)
      return rest;
    }
    return { provider: payload.provider, email: payload.email };
  }

  success(user: any, info?: any): void {
    // console.log('user');
  }
}
