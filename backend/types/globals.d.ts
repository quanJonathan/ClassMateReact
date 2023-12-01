/* eslint-disable prettier/prettier */
import { authTypeEnum } from 'src/enum/authType.enum';
import {User as UserEntity } from 'src/user/model/user.schema'
/* eslint-disable prettier/prettier */
declare global {
  interface IconfigService {
    COOKIE_KEY?: string;
    DB_NAME?: string;
    JWT_ACCESS_SECRET?: string;
    JWT_REFRESH_SECRET?: string;
    OAUTH_GOOGLE_ID?: string;
    OAUTH_GOOGLE_SECRET?: string;
    OAUTH_GOOGLE_REDIRECT_URL?: string;
  }

  interface IconfigServiceFB{
    COOKIE_KEY?: string;
    DB_NAME?: string;
    JWT_ACCESS_SECRET?: string;
    JWT_REFRESH_SECRET?: string;
    FACEBOOK_ID?: string;
    FACEBOOK_SECRET?: string;
    FACEBOOK_REDIRECT_URL?: string;
  }

  interface IGoogleUser {
    provider: string;
    providerId: string;
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
    accessToken?: string;
    refreshToken?: string;
  }

  interface IFaceBookUser{
    provider: string;
    providerId: string;
    email: string;
    firstName: string;
    lastName: string;
    photo: string;
    accessToken: string;
    refreshToken: string;
  }

  namespace Express {
    interface Request {
      userEntity?: UserEntity;
    }
  }
  
  interface IJwtPayload {
    provider: authTypeEnum;
    email: string;
  }

  interface IJWTTokensPair {
    accessToken: string;
    refreshToken: string;
  }
}

export {};
