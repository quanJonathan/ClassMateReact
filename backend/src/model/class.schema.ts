/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
export type ClassDocument = Class & Document;


// Note that the classId is for shown only
// the real id is the autoGenerated _id
@Schema()
export class Class {
 @Prop({required:true, unique:true})
 name: string
 @Prop({required: true, unique: true})
 classId: string
 @Prop()
 members: {type: [mongoose.ObjectId], ref: 'User'}
 @Prop()
 homeworks: {type: [mongoose.ObjectId], ref: 'Homework'}
 @Prop({unique: true})
 accessLink?: string
 @Prop({required: true})
 compositions: {type: [mongoose.ObjectId], ref: 'GradeComposition'};
}

export const ClassSchema = SchemaFactory.createForClass(Class);