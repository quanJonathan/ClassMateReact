/* eslint-disable prettier/prettier */
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { userStateEnum } from 'src/enum/userState.enum';
import {
  Notification,
  NotificationDocument,
} from 'src/model/notification.schema';
import { User, UserDocument } from 'src/user/model/user.schema';

export class NotificationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async getAllNotification(): Promise<Notification[]> {
    const notifications = await this.notificationModel.find();
    //console.log(classes);
    return notifications;
  }

  async getByRealId(id: ObjectId): Promise<Notification | any> {
    return await this.notificationModel.findById(id);
  }

  async getOneByRealId(id: ObjectId): Promise<Notification | any> {
    return await this.notificationModel.findOne({ _id: id });
  
  }

  async getAllUserNotification(userId: ObjectId): Promise<Notification[]> {
    const notifications =  await this.notificationModel.find({user: userId}).sort({ createdDate: -1 }) // Sort by createdDate in descending order
    .limit(10).exec();
   
    return notifications;
  }

  async addNewNotification(userId: ObjectId, notificationObject: Notification):  Promise<Notification | any> {
    const foundUser = await this.userModel.findById(userId);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    if (foundUser.state == userStateEnum.banned) {
      throw new BadRequestException('This user is currently banned');
    }

  
    const newNotification = { ...notificationObject, user: foundUser };

  
    const createNotification = new this.notificationModel(newNotification);
   

    // foundUser.classes.push({ classId: createClass, role: '3000' });
    await createNotification.save();
    // await foundUser.save();

    return `Push notification ${notificationObject.name} successfully`;
  }
}
