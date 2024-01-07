/* eslint-disable prettier/prettier */
import { Controller, Get, HttpStatus, Param, Post, Req, Res } from '@nestjs/common';
import { EmailConfirmationService } from 'src/email/emailConfirmation.service';
import { GradeReviewService } from 'src/services/grade-review.service';

@Controller('gradeReview')
export class GradeReviewController {
  constructor(
    private gradeReviewService: GradeReviewService,
    private emailConfirmService: EmailConfirmationService,
  ) {}

  @Get('/h/:homeworkId')
  async getAllGradeReviewForHomework(@Res() res: any, @Req() req: any, @Param() params: any ){
    const homeworkId = params.homeworkId

    return this.gradeReviewService.getGradeReviews(homeworkId)
  }

  @Post('/add/h/:homeworkId')
  async addNewGradeReviewForHomework(@Res() res: any, @Req() req: any, @Param() params: any ){
    const homeworkId = params.homeworkId

    const studentId = req.body.student
    const gradeReview = req.body.gradeReview

    const result = await this.gradeReviewService.addNewGradeReview(homeworkId, studentId, gradeReview)

    if(result){
        await this.emailConfirmService.sendNotificationForGradeReview(homeworkId, result)
        return res.status(HttpStatus.OK).json("Request grade review successfully")
    }
    return res.status(HttpStatus.BAD_REQUEST).json()
  }
}

