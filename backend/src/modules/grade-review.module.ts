/* eslint-disable prettier/prettier */
import { GradeReview, GradeReviewSchema } from 'src/model/grade-review.schema';
import { Homework, HomeworkSchema } from 'src/model/homework.schema';
import { GradeReviewService } from 'src/services/grade-review.service';
import { User, UserSchema } from 'src/user/model/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Homework.name, schema: HomeworkSchema },
    ]),
    MongooseModule.forFeature([
      { name: GradeReview.name, schema: GradeReviewSchema },
    ]),
  ],
  providers: [GradeReviewService],
  exports: [GradeReviewService],
})
export class GradeReviewModule {}
