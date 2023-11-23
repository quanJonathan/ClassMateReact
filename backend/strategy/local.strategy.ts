/* eslint-disable prettier/prettier */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly authService: AuthService,
    ) {
    super({
       usernameField: 'email'
    });
  }

  async validate(email: string, password: string) {
     const user = await this.authService.localUserValidate(email, password);
     //console.log(user)
     if(!user){
        throw new UnauthorizedException()
     }
     // console.log(user)
     return user
  }
}
