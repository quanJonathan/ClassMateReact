/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { authTypeEnum } from 'src/enum/authType.enum';
import mongoose, { Document, ObjectId } from 'mongoose';
import { userStateEnum } from 'src/enum/userState.enum';
import { Class } from 'src/model/class.schema';
export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;
  @Prop({required: true})
  lastName: string;
  @Prop({ lowercase: true })
  email: string;
  @Prop()
  password: string;
  @Prop({ default: Date.now() })
  createdDate: Date;
  @Prop()
  address: string;
  @Prop()
  phoneNumber: string;
  @Prop({required: true, unique: true})
  roles: [string];
  @Prop({default: authTypeEnum.local, enum: authTypeEnum})
  provider: string;
  @Prop({default: Object.keys(authTypeEnum).indexOf('local')})
  providerId: string;
  @Prop()
  name: string;
  @Prop({default: ''})
  refreshToken: string;
  @Prop({default: ''})
  accessToken: string;
  @Prop()
  photo: string;
  @Prop({default: userStateEnum.notActivated, enum: userStateEnum})
  state: string;
  @Prop({type: [{'classId' : {type: mongoose.Schema.Types.ObjectId, ref: 'Class'}, 'role' : String}]})
  classes: {'classId': ObjectId | Class, 'role': string}[]

  @Prop({unique: true})
  studentId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);