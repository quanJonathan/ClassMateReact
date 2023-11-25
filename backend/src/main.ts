/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(3001);
  // const whitelist = [
  //   'http://localhost',
  //   'http://localhost:3000',
  //   'http://localhost:3001',
  //   'https://accounts.google.com/o/oauth2/v2',
  //   'https://classmatebe.onrender.com/auth/google-logins',
  //   'https://classmatebe.onrender.com/auth/google/callback',
  //   'https://classmatebe.onrender.com/callback/last/:access/:refresh',
  // ];
   app.enableCors({
  //   // credentials: true,
  //   origin: function (origin, callback) {
  //     if (!origin || whitelist.indexOf(origin) !== -1) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   },
   });
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
