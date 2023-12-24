/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './model/user.schema';
import { Model } from 'mongoose';
import { UserRoles } from '../enum/userRole.enum';
import { authTypeEnum } from '../enum/authType.enum';
import { hashData } from '../helpers/hash-data';
import { userStateEnum } from 'src/enum/userState.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createNewLocalUser(user: User): Promise<User> {

    const userExists = await this.userModel.findOne({email: user.email}).exec();

    if(userExists){
      throw new BadRequestException('User already exists')
    }
    
    const defaultUserRoles = [UserRoles.student]
    const password = await hashData(user.password)
    
    const newUser = new this.userModel({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: password,
      roles: defaultUserRoles,
      provider: authTypeEnum.local,
      address: "",
      phoneNumber: "",
      photo: "",
      state: userStateEnum.notActivated
    })
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
      roles: defaultUserRoles
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
      roles: defaultUserRoles
    });


    return (await user).save();
  }


  async findByEmail(email: string): Promise<User[]> {
    const find = await this.userModel.find({email: email}).lean().exec();
    // console.log(find);
    return find;
  }

  async findByToken(token: string): Promise<User[]> {
    const find = await this.userModel.find({refreshToken: token}).lean().exec();
    //console.log(find);
    return find;
  }

  async findOneByEmailAndProvider(email: string, provider: authTypeEnum): Promise<User>{
    const find = await this.userModel.findOne({email: email, provider: provider})
    .populate({
      path: 'classes.classId classes.role',
      select: 'className _id classId'
    })
    .lean()
    .exec();
    console.log(find);
    return find;
  }

  async findOneById(id: number): Promise<User> {
    if (!id) {
      throw new NotFoundException('user not found');
    }
    const find = await this.userModel.findById(id).exec()
    if (!find) {
      throw new NotFoundException('user not found');
    }
    return find;
  }


  async updateToken(email: string, provider: string,  token: string): Promise<User>{
    console.log("update token with " + email + " " + provider + " " + token);
    return await this.userModel.findOneAndUpdate({email:email, provider: provider}, {$set: {refreshToken: token}}, {new: true});
  }

  async findAll(): Promise<User[]> {
    const allUsers: User[] = await this.userModel.find({});
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
    return await this.userModel.findOneAndUpdate({email: user.email}, {$set: {
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      phoneNumber: user.phoneNumber
    }})
  }

  async updateState(user: User, state: string) {
    return await this.userModel.findOneAndUpdate({email: user.email}, {$set: {
      state: state,
    }})
  }

  async updatePassword(email: string, password: string) {
    const newPassword = await hashData(password)
    return await this.userModel.findOneAndUpdate({email}, {$set: {
      password: newPassword,
    }})
  }

  async getOne(email: string): Promise<User> {
    return await this.userModel.findOne({email: email}, {password: 0}).exec()
  }

  async createUserByAdmin(user: User): Promise<User> {

    const userExists = await this.userModel.findOne({email: user.email}).exec();

    if(userExists){
      throw new BadRequestException('User already exists')
    }
    
    const defaultUserRoles = [UserRoles.student]
    const password = await hashData(user.password)
    
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
      state: userStateEnum.activated
    })
    return await newUser.save();
  }
}
