import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { UsersModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from 'strategy/local.strategy';
import { GoogleStrategy } from 'strategy/google.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessTokenStrategy } from 'strategy/accessToken.strategy';
import { RefreshTokenStrategy } from 'strategy/refreshToken.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    // PassportModule,
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     secretOrPrivateKey: configService.get<string>('JWT_ACCESS_SECRET'),
    //     signOptions: {
    //       expiresIn: '1h',
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
