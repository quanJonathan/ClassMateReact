/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
export type GradeReviewDocument = GradeReview & Document;

// Note that the classId is for shown only
// the real id is the autoGenerated _id
@Schema()
export class GradeReview {

  // the class _id field
  @Prop({required: true})
  classId: {type: mongoose.ObjectId, ref: 'Class'}
  @Prop({required: true})
  homeWorkId: {type: mongoose.ObjectId, ref: 'Homework'}
  
  @Prop({required: true})
  teacherId: {type: mongoose.ObjectId, ref: 'User'}
  @Prop({required: true})
  studentId: {type: mongoose.ObjectId, ref: 'User'}

  @Prop({required: true})
  studentExplanation: string
  @Prop({required: true})
  teacherComment: {type: string, max: 400}

  @Prop()
  expectedGrade: {type: number, min: 0, max: 10}

  // accepted, declined, pending, finalized
  @Prop()
  state: string
}

export const GradeReviewSchema = SchemaFactory.createForClass(GradeReview);