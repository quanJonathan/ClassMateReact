import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'model/user.schema';
import { UserService } from 'service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async localLogin(user: User): Promise<any> {
    const currentUser = this.userService.signin(user, this.jwtService);
    return currentUser;
  }

  async localSignUp(user: User) {
    const newUser = await this.userService.signup(user);

    return newUser;
  }
}
