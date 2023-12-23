/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { authTypeEnum } from '../enum/authType.enum';
import { hashData } from '../helpers/hash-data';
import { validateHashedData } from '../helpers/validate-hash-data';
import { User } from '../user/model/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {

  constructor(
    private configService: ConfigService<IconfigService>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async localUserValidate(
    email: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const [user] = await this.userService.findByEmail(email);
    // console.log(user);
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user.provider !== authTypeEnum.local) {
      throw new NotAcceptableException(
        `${email} address has registered via ${user.provider}!`,
      );
    }

    const passwordValidation = await validateHashedData(
      password,
      user.password,
    );

    //console.log(passwordValidation);
    if (user && passwordValidation) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }


  async checkUserExist(
    email: string,
  ): Promise<Partial<User> | null> {
    const [user] = await this.userService.findByEmail(email);
    // console.log(user);
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user.provider !== authTypeEnum.local) {
      throw new NotAcceptableException(
        `${email} address has registered via ${user.provider}!`,
      );
    }
;
    if (user) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }




  async facebookUserValidate(
    facebookUser: IFaceBookUser
    ): Promise<Partial<User> | null> {
      //console.log(facebookUser.email)
      const [user] = await this.userService.findByEmail(facebookUser?.email);
      if (!user) {
        const newUser = await this.userService.createUserWithFacebook(facebookUser);
        return newUser;
      }
      if (user.provider !== authTypeEnum.facebook) {
        throw new NotAcceptableException(
          `${facebookUser.email} address has registered via ${user.provider}!`,
        );
      }
      if (user) {
        return user;
      }
  
      return null;
  }

  async googleUserValidate(
    googleUser: IGoogleUser,
  ): Promise<Partial<User> | null> {
    //console.log(googleUser.email)
    const [user] = await this.userService.findByEmail(googleUser?.email);
    if (!user) {
      const newUser = await this.userService.createUserWithGoogle(googleUser);
      return newUser;
    }
    if (user.provider !== authTypeEnum.google) {
      throw new NotAcceptableException(
        `${googleUser.email} address has registered via ${user.provider}!`,
      );
    }
    if (user) {
      return user;
    }

    return null;
  }

  async localSignUp(user: User) {
    const newUser = await this.userService.createNewLocalUser(user);
    const tokens = await this.getTokens(
      newUser.email,
      authTypeEnum[newUser.provider],
    );
    await this.updateRefreshToken(
      newUser.email,
      authTypeEnum[newUser.provider],
      tokens.refreshToken,
    );
    return tokens;
  }

  async login(user: User): Promise<IJWTTokensPair> {
    // console.log(Object.values(user));
    const tokens = await this.getTokens(
      user.email,
      authTypeEnum[user.provider],
    );
    await this.updateRefreshToken(
      user.email,
      authTypeEnum[user.provider],
      tokens.refreshToken,
    );
    return tokens;
  }

  async logout(email: string, provider: authTypeEnum): Promise<User> {
    return this.userService.updateToken(email, provider, null);
  }

  async updateRefreshToken(
    email: string,
    provider: authTypeEnum,
    refreshToken: string,
  ) {
    const hashedRefreshToken = await hashData(refreshToken);
    return await this.userService.updateToken(
      email,
      provider,
      hashedRefreshToken,
    );
  }

  async getTokens(
    email: string,
    provider: authTypeEnum,
  ): Promise<IJWTTokensPair> {
    //console.log(id);
    const payload = { email: email, provider: provider };
    //console.log('payload ' + payload.email + ' ' + payload.provider);
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '1h',
      }),
    ]);

    //console.log("accessToken " + accessToken);
    //console.log("refreshToken " + refreshToken);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refreshTokens(
    email: string,
    provider: authTypeEnum,
    refreshToken: string,
  ): Promise<IJWTTokensPair> {
    const user = await this.userService.findOneByEmailAndProvider(
      email,
      provider,
    );
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await validateHashedData(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(
      user.email,
      authTypeEnum[user.provider],
    );
    await this.updateRefreshToken(
      user.email,
      authTypeEnum[user.provider],
      tokens.refreshToken,
    );
    return tokens;
  }
}
