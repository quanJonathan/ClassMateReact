/* eslint-disable prettier/prettier */
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
  GradeReview,
  GradeReviewDocument,
} from 'src/model/grade-review.schema';
import { Homework, HomeworkDocument } from 'src/model/homework.schema';
import { User, UserDocument } from 'src/user/model/user.schema';

export class GradeReviewService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Homework.name) private homeworkModel: Model<HomeworkDocument>,
    @InjectModel(GradeReview.name)
    private gradeReviewModel: Model<GradeReviewDocument>,
  ) {}

  async addNewGradeReview(
    homeworkId: ObjectId,
    studentId: ObjectId,
    gradeReview: GradeReview,
  ) {
    const foundHomework = await this.homeworkModel.findById(homeworkId);
    if (!foundHomework) {
      throw new NotFoundException('Homework not found');
    }

    const foundGradeReview = await this.gradeReviewModel.findOne({
      homeWorkId: foundHomework._id,
      userPair: { $elemMatch: { $eq: studentId } },
    });

    if (foundGradeReview) {
      throw new BadRequestException('Can only request grade review once');
    } else {
      const newGradeReview = new this.gradeReviewModel({
        ...gradeReview,
        homeWorkId: foundHomework,
        state: 'pending',
      });

      await newGradeReview.save();

      return {
        homework: foundHomework,
        gradeReview: newGradeReview,
      };
    }
  }

  async getGradeReviews(homeworkId: any) {
    const foundGradeReview = await this.gradeReviewModel
      .find({ homeWorkId: homeworkId })
      .populate({
        path: 'user',
        select: 'email _id studentId',
      })
      .populate({
        path: 'comments.userId comments.content',
        select: 'email _id',
      })
      .exec();

    // console.log(foundGradeReview);
    return foundGradeReview;
  }

  async getGradeReview(homeworkId: ObjectId, studentId: ObjectId) {
    const foundHomework = await this.homeworkModel.findById(homeworkId);
    if (!foundHomework) {
      throw new NotFoundException('Homework not found');
    }

    const foundGradeReview = await this.gradeReviewModel.findOne({
      homeWorkId: foundHomework._id,
      userPair: { $elemMatch: { $eq: studentId } },
    });

    if (!foundGradeReview) {
      throw new NotFoundException('No grade reviews');
    } else {
      return foundGradeReview;
    }
  }

  async addNewComment(_id: ObjectId, comment: Comment) {
    const gradeReview = await this.gradeReviewModel.findById(_id).populate({
      path: 'homeWorkId',
      select: 'name',
    });
    const foundUser = await this.userModel.findById(comment.id);
    if (!gradeReview) {
      throw new NotFoundException('This grade review not existed');
    }

    gradeReview.comments.push({
      userId: foundUser,
      content: comment.content,
      role: comment.role,
    });

    await gradeReview.save();
    return {
      homeworkName: gradeReview?.homeWorkId?.name,
      user: foundUser
    };
  }
}
