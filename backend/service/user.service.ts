/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'model/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async signup(user: User) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    console.log(user)
    const reqBody = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: hash,
      address: "",
      phoneNumber: ""
    };
    const newUser = new this.userModel(reqBody);
    return newUser.save();
  }

  async signin(user: User, jwt: JwtService): Promise<any> {
    const foundUser = await this.userModel
      .findOne({ email: user.email })
      .exec();
    if (foundUser) {
      const { password } = foundUser;
      if (bcrypt.compare(user?.password, password)) {
        const payload = { email: user.email };
        return {
          token: jwt.sign(payload),
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          email: foundUser.email,
          phoneNumber: foundUser.phoneNumber,
          address: foundUser.address
        };
      }
      return new HttpException(
        'Incorrect username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return new HttpException(
      'Incorrect username or password',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async update(user: User) {
    return await this.userModel.findOneAndUpdate({email: user.email}, {$set: user}).exec()
  }

  async getOne(email: string): Promise<User | any> {
    return await this.userModel.findOne({email: email}, {password: 0}).exec()
  }
}
