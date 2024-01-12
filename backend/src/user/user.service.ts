/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './model/user.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { UserRoles } from '../enum/userRole.enum';
import { authTypeEnum } from '../enum/authType.enum';
import { hashData } from '../helpers/hash-data';
import { userStateEnum } from 'src/enum/userState.enum';
import { validateHashedData } from 'src/helpers/validate-hash-data';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createNewLocalUser(user: User): Promise<User> {
    const userExists = await this.userModel
      .findOne({ email: user.email })
      .exec();

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const defaultUserRoles = [UserRoles.student];
    const password = await hashData(user.password);

    const newUser = new this.userModel({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: password,
      roles: defaultUserRoles,
      provider: authTypeEnum.local,
      address: '',
      phoneNumber: '',
      photo: '',
      state: userStateEnum.notActivated,
    });
    return await newUser.save();
  }

  async markEmailAsConfirmed(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    //console.log(`user ${email} has activated`);
    return this.updateState(user[0], userStateEnum.activated);
  }

  async createUserWithGoogle(googleUser: IGoogleUser): Promise<User> {
    // Check if user exists
    const [userExists] = await this.findByEmail(googleUser.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const defaultUserRoles = [UserRoles.student];

    //console.log(googleUser.firstName)
    //console.log(googleUser.lastName)

    // Create new User
    const user = this.userModel.create({
      ...googleUser,
      state: userStateEnum.activated,
      roles: defaultUserRoles,
    });

    return (await user).save();
  }

  async createUserWithFacebook(facebookUser: IFaceBookUser): Promise<User> {
    const [userExists] = await this.findByEmail(facebookUser.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const defaultUserRoles = [UserRoles.student];

    //console.log(facebookUser.firstName)
    //console.log(facebookUser.lastName)

    // Create new User
    const user = this.userModel.create({
      ...facebookUser,
      state: userStateEnum.activated,
      roles: defaultUserRoles,
    });

    return (await user).save();
  }

  async findByEmail(email: string): Promise<User[]> {
    const find = await this.userModel.find({ email: email }).lean().exec();
    // console.log(find);
    return find;
  }

  async findByStudentID(id: string): Promise<User[]> {
    const find = await this.userModel.find({ studentId: id }).lean().exec();
    // console.log(find);
    return find;
  }

  async findByToken(token: string): Promise<User[]> {
    const find = await this.userModel
      .find({ refreshToken: token })
      .lean()
      .exec();
    //console.log(find);
    return find;
  }

  async findOneByEmailAndProvider(
    email: string,
    provider: authTypeEnum,
  ): Promise<User> {
    const find = await this.userModel
      .findOne({ email: email, provider: provider })
      .populate({
        path: 'classes.classId classes.role',
        select: 'className _id classId description',
      })
      .lean()
      .exec();
    // console.log(find);
    return find;
  }

  async findOneById(id: number): Promise<User> {
    if (!id) {
      throw new NotFoundException('user not found');
    }
    const find = await this.userModel.findById(id).exec();
    if (!find) {
      throw new NotFoundException('user not found');
    }
    return find;
  }

  async updateToken(
    email: string,
    provider: string,
    token: string,
  ): Promise<User> {
    console.log('update token with ' + email + ' ' + provider + ' ' + token);
    return await this.userModel.findOneAndUpdate(
      { email: email, provider: provider },
      { $set: { refreshToken: token } },
      { new: true },
    );
  }

  async findAll(): Promise<User[]> {
    const allUsers: User[] = await this.userModel
      .find({})
      .sort({ createdDate: -1 });
    return allUsers;
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.userModel.findByIdAndDelete(id);
  }

  async update(user: User) {
    return await this.userModel.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
          phoneNumber: user.phoneNumber,
          studentId: user.studentId,
        },
      },
    );
  }

  async setUserStudentId(student: Student) {
    const acc = await this.userModel.findById(student._id);
    if (!acc) {
      throw new NotFoundException('User not found');
    }

    acc.studentId = student.studentId;
    return await acc.save();
  }

  async adminUpdate(user) {
    const u = await this.findOneById(user._id);
    if (!u) {
      console.log('User not found');
      return;
      throw new BadRequestException('user not found');
    }
    let pass = null;

    if (user.studentId && user.studentId != u.studentId) {
      const userExists = await this.userModel
        .findOne({ studentId: user.studentId })
        .exec();
      if (userExists) {
        throw new BadRequestException(
          `StudentId ${user.studentId} already in-use`,
        );
      }
    }

    if (user.oldPassword) {
      const passwordValidation = true;
      if (!passwordValidation) {
        console.log('Password Incorrect');
        return await this.userModel.findOneAndUpdate(
          { _id: user._id },
          {
            $set: {
              firstName: user.firstName,
              lastName: user.lastName,
              address: user.address,
              phoneNumber: user.phoneNumber,
            },
          },
        );
      }
      pass = await hashData(user.newPassword);
      console.log(pass);
      return await this.userModel.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            phoneNumber: user.phoneNumber,
            email: user.email,
            studentId: user.studentId,
            password: pass,
          },
        },
      );
    }
    return await this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
          phoneNumber: user.phoneNumber,
          email: user.email,
          studentId: user.studentId,
        },
      },
    );
  }

  async updateEmptyAccount(user) {
    console.log(user);
    const u = await this.findOneById(user._id);
    if (!u) {
      console.log('User not found');
      return;
      throw new BadRequestException('user not found');
    }
    let pass = user.password;

    pass = await hashData(user.password);
    console.log(pass);
    return await this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
          phoneNumber: user.phoneNumber,
          email: user.email,
          studentId: user.studentId,
          password: pass,
        },
      },
    );
  }

  async updateState(user: User, state: string) {
    if (user.email)
      return await this.userModel.findOneAndUpdate(
        { email: user.email },
        {
          $set: {
            state: state,
          },
        },
      );
    else {
      return await this.userModel.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            state: state,
          },
        },
      );
    }
  }

  async getOneById(_id: mongoose.Types.ObjectId) {
    return await this.userModel.findById(_id);
  }

  async updateStudentId(user: User) {
    const userExists = await this.userModel
      .findOne({ studentId: user.studentId })
      .exec();
    if (userExists) {
      throw new BadRequestException(
        `StudentId ${user.studentId} already in-use`,
      );
    }
    return await this.userModel.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          studentId: user.studentId,
        },
      },
    );
  }

  async updatePassword(email: string, password: string) {
    const newPassword = await hashData(password);
    return await this.userModel.findOneAndUpdate(
      { email },
      {
        $set: {
          password: newPassword,
        },
      },
    );
  }

  async getOneByEmail(email: string): Promise<User> {
    return await this.userModel
      .findOne({ email: email }, { password: 0 })
      .exec();
  }

  async getOneEmail(id: ObjectId): Promise<string> {
    return (await this.userModel.findById(id)).email;
  }

  async createUserByAdmin(user: User): Promise<User> {
    const userExists = await this.userModel
      .findOne(
        user.email ? { email: user.email } : { studentId: user.studentId },
      )
      .exec();

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const defaultUserRoles = [UserRoles.student];
    const password = await hashData(user.password);

    const newUser = new this.userModel({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: password,
      roles: defaultUserRoles,
      provider: authTypeEnum.local,
      address: user.address,
      phoneNumber: user.phoneNumber,
      photo: user.photo,
      state: userStateEnum.activated,
      studentId: user.studentId,
    });
    return await newUser.save();
  }
}
