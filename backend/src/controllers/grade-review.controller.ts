/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { EmailConfirmationService } from 'src/email/emailConfirmation.service';
import { Notification } from 'src/model/notification.schema';
import { ClassService } from 'src/services/class.service';
import { GradeReviewService } from 'src/services/grade-review.service';
import { NotificationService } from 'src/services/notification.service';
import { UserService } from 'src/user/user.service';

@Controller('gradeReview')
export class GradeReviewController {
  constructor(
    private gradeReviewService: GradeReviewService,
    private notificationService: NotificationService,
    private emailConfirmService: EmailConfirmationService,
    private classService: ClassService,
    private userService: UserService,
  ) {}

  @Get('/h/:homeworkId')
  async getAllGradeReviewForHomework(@Param() params: any) {
    const homeworkId = params.homeworkId;
    console.log(homeworkId);
    const result = await this.gradeReviewService.getGradeReviews(homeworkId);
    console.log(result);
    return result;
  }

  @Post(':id/comment')
  async addNewComment(
    @Param() params: any,
    @Body() body: any,
    @Res() res: any,
  ) {
    const _id = params.id;
    const comment = body.comment;
    const target = body.target;

    const result = await this.gradeReviewService.addNewComment(_id, comment);
    if (result) {
      const noti = {
        name:
          comment.role === '3000'
            ? 'Teacher '
            : 'Student ' +
              result.user.firstName +
              ' ' +
              result.user.lastName +
              ' has reply to grade review of ' +
              result.homeworkName,
        url: '',
        content: body.content,
      };

      this.notificationService.addNewNotification(target, noti);
      return res.status(HttpStatus.ACCEPTED).json(result);
    }
    return res.status(HttpStatus.BAD_REQUEST).json();
  }

  @Post('/add/h/:homeworkId')
  async addNewGradeReviewForHomework(
    @Res() res: any,
    @Req() req: any,
    @Param() params: any,
  ) {
    const homeworkId = params.homeworkId;

    const studentId = req.body.student;
    const gradeReview = req.body.gradeReview;

    const result = await this.gradeReviewService.addNewGradeReview(
      homeworkId,
      studentId,
      gradeReview,
    );

    if (result) {
      const gradeReview = result.gradeReview;
      const homework = result.homework;
      const foundUser = await this.userService.getOneById(
        gradeReview.user[0]._id,
      );
      const notification = {
        name:
          foundUser?.firstName +
          ' ' +
          foundUser?.lastName +
          ' requested a grade review for ' +
          homework.name,
        url: '',
        content: 'Expected grade: ' + gradeReview.expectedGrade,
      };

      const foundClass = await this.classService.getClassByHomework(homeworkId);

      // await this.emailConfirmService.sendNotificationForGradeReview(
      //   homeworkId,
      //   result,
      // );

      // console.log(foundClass)

      await this.notificationService.addNewNotificationForAllTeacher(
        foundClass,
        notification,
      );

      return res
        .status(HttpStatus.OK)
        .json('Request grade review successfully');
    }
    return res.status(HttpStatus.BAD_REQUEST).json();
  }
}
