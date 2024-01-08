/* eslint-disable prettier/prettier */
import {
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
      const foundUser = await this.userService.getOneById(result.user[0]._id)
      const notification = {
        name: foundUser?.firstName + ' ' + foundUser?.lastName + "requested a grade review",
        url: '',
        content: 'Expected grade: ' + result.expectedGrade,
      };
      console.log(result.user)
      const foundClass = await this.classService.getClassByHomework(homeworkId)

      // await this.emailConfirmService.sendNotificationForGradeReview(
      //   homeworkId,
      //   result,
      // );

      console.log(foundClass)

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
