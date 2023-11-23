/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request as ExpressReq } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    protected configService: ConfigService<IconfigService>,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //   ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  async validate(req: ExpressReq, payload: IJwtPayload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    if (payload.provider && payload.email) {
      const { password, ...rest } = await this.userService.findOneByEmailAndProvider(
        payload.email, payload.provider
      );
      return { ...rest, refreshToken };
    }
    return { provider: payload.provider, email: payload.email, refreshToken };
  }
}
