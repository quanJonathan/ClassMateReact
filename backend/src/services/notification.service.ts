/* eslint-disable prettier/prettier */
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GradeComposition } from 'src/model/grade-composition.schema';
import {
  Notification,
  NotificationDocument,
} from 'src/model/notification.schema';
import { User, UserDocument } from 'src/user/model/user.schema';

export class NotificationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Notification.name)
    private gradeCompositionModel: Model<NotificationDocument>,
  ) {}
}
