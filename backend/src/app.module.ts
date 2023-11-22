/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { secret } from 'utils/constants';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from 'controllers/user.controller';
import { UserService } from 'service/user.service';
import { User, UserSchema } from 'model/user.schema';
import { isAuthenticated } from './app.middleware';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'strategy/jwt.strategy';
import { JwtAuthGuard } from 'guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot(
      'mongodb+srv://tuanquan:nMQxwnon5RLhvgUz@classmatecluster.tcuesuz.mongodb.net/class-mate-react',
    ),
    PassportModule
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAuthenticated)
      .exclude({ path: 'auth/profile', method: RequestMethod.GET });
  }
}
