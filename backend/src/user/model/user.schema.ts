/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { authTypeEnum } from 'src/enum/authType.enum';
import { Document } from 'mongoose';
export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;
  @Prop({required: true})
  lastName: string;
  @Prop({ required: true, unique: true, lowercase: true })
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
}

export const UserSchema = SchemaFactory.createForClass(User);