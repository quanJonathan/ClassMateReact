/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/authorization/roles.decorator';
import { RolesGuard } from 'src/authorization/roles.guard';
import { EmailConfirmationService } from 'src/email/emailConfirmation.service';
import { UserRoles } from 'src/enum/userRole.enum';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import { ClassService } from 'src/services/class.service';
import { NotificationService } from 'src/services/notification.service';
import { User } from 'src/user/model/user.schema';

@Controller('class')
export class ClassController {
  constructor(
    private classService: ClassService,
    private emailConfirmService: EmailConfirmationService,
    private notiService: NotificationService
  ) {}

  @Get('/all')
  async getAll() {
    return this.classService.getAllClass();
  }

  @Get('/:id')
  async getByRealId(@Param() params: any) {
    return this.classService.getByRealId(params.id);
  }

  @Get('/getClass/:id')
  async getById(@Param() params: any) {
    //console.log("get class")
    return this.classService.getById(params.id);
  }

  @Get('/getClassMember/:classId')
  async getMember(@Param() params: any) {
    const data = await this.classService.getMember(params.classId);
    //console.log(data)
    return data;
  }

  @Post('/addClass')
  @UseGuards()
  async addClass(@Res() res: any, @Body() body) {
    const classObject = body.class;
    const user = body.user;
    const result = await this.classService.addClass(classObject, user);

    if (result) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json('Create failed');
    }
  }

  @Get('/getOne/:id')
  async getClassId(@Param() params: any) {
    //console.log("get class")
    //console.log(params)
    return await this.classService.getByClassId(params.id);
  }

  @Post('/updateState/')
  async updateState(@Body() body) {
    // console.log(body);
    return await this.classService.updateState(body);
  }

  @Post('/updateState')
  @UseGuards()
  async update(@Body() body) {
    const classObject = body;
    // console.log(body)
    return this.classService.updateState(classObject);
  }

  @Post('/generateAccessLink/:id')
  async generateAndReturn(@Param() params: any) {
    return this.classService.generateAccessLink(params.id);
  }

  @Post('/joinClass/:id')
  @UseGuards(RefreshTokenGuard)
  async joinClass(@Body() body, @Param() params: any, @Res() res: any) {
    // console.log("joining class")
    const user = body;
    // console.log(params)
    const classId = params.id;
    // console.log(classId)
    const response = await this.classService.addStudent(classId, user._id);
    if(response){
      return res.status(HttpStatus.ACCEPTED).json(response)
    }
    return res.status(HttpStatus.BAD_REQUEST).json()
  }

  @Post('/joinClassWithId/:classId')
  async joinClassWithId(@Body() body, @Param() params: any, @Res() res: any) {
    // console.log("joining class")
    const user = body;
    const classId = params.classId;
    // console.log(classId)
    const response = await this.classService.addStudentWithClassId(classId, user._id);
    if(response){
      // console.log(response)
      return res.status(HttpStatus.ACCEPTED).json(response)
    }
    return res.status(HttpStatus.BAD_REQUEST).json()
  }


  @Post('/joinClassAsTeacher/:id')
  @UseGuards(RefreshTokenGuard)
  async joinClassAsTeacher(@Req() req, @Param() params: any, @Res() res: any) {
    console.log('joining class');
    const user = req.user;
    const classId = params.id;
    // console.log(classId);
    const response = await this.classService.addTeacher(classId, user._id);

    if(response){
      return res.status(HttpStatus.ACCEPTED).json(response)
    }
    return res.status(HttpStatus.BAD_REQUEST).json()
  }

  @Put('/addStudent/:classId')
  @UseGuards(RefreshTokenGuard, RolesGuard)
  @Roles(UserRoles.admin, UserRoles.teacher)
  async addStudentToClass(@Req() req, @Param() params: any) {
    const user = req.user;
    const classId = params.id;
    return this.classService.addStudent(classId, user._id);
  }

  @Post('/addStudents/:classId')
  //@UseGuards(RefreshTokenGuard)
  async addStudentsToClass(@Body() body, @Param() params: any, @Res() res: any) {
    console.log('adding multiple user');
    const students = body;
    // console.log(students);
    const classId = params.classId;
    const response = this.classService.addStudentViaDocument(classId, students);
    if(response){
      return res.status(HttpStatus.ACCEPTED || HttpStatus.OK).json("Added successfully")
    }

    return res.status(HttpStatus.BAD_REQUEST).json()
  }

  @Post('/removeStudent/:studentId')
  // @UseGuards(RefreshTokenGuard, RolesGuard)
  // @Roles(UserRoles.admin, UserRoles.teacher)
  async removeStudent(
    @Req() req,
    @Body() body: { id: string },
    @Param() params: any,
  ) {
    // console.log(body.id);
    return this.classService.removeStudent(body.id, params.studentId);
  }

  @Post('/updateOrAddGradeCompositions/:id')
  // @UseGuards(RefreshTokenGuard)
  async updateComposition(@Req() req, @Param() params: any) {
    console.log('Updating grade compositions');
    const compositions = req.body;
    return this.classService.updateComposition(params.id, compositions);
  }

  @Post('/updateHomeworkScore/:id/a/:homeworkId')
 // @UseGuards(RefreshTokenGuard)
  async updateHomeworkScore(
    @Body() body,
    @Param() params: any,
    @Res() response: any,
  ) {
    console.log('Updating score');
    const _id = params.id;
    const homeworkId = params.homeworkId;

    const homeworks = body;
    console.log(homeworks);
    const result = await this.classService.updateHomeworkScore(
      _id,
      homeworks,
      homeworkId,
    );
    console.log(result)

    if (result) {
      return response.status(HttpStatus.OK).json('Update data successfully');
    }
    return response.status(HttpStatus.BAD_REQUEST).json();
  }

  @Post('/updateHomework/:id')
  async updateHomework(@Body() body, @Param() params: any) {
    const newData = body;
    const id = params.id;
    // console.log(id)
    // console.log(newData)

    return this.classService.updateHomework(newData, id);
  }

  @Post('/returnHomework/:id/a/:homeworkId')
  async returnHomework(@Body() body, @Param() params: any, @Res() res: any) {
    console.log('Returning');
    const _id = params.id;
    const userId = body.userId;
    const teacherName = body.teacherName;
    const homeworkId = params.homeworkId;

    // console.log(_id);
    // console.log(userId);
    // console.log(homeworkId);

    const result = await this.classService.returnHomework(
      _id,
      homeworkId,
      userId,
    );

    if (result) {
      const user = result.user
      const className = result.className
      const homework = result.homework
      this.emailConfirmService.sendReturnHomeworkLink(
        user,
        className,
        homework,
      );

      const notification = {
        name: teacherName + ` has returned homework ${homework.name}  in ` + className,
        url: '',
        content: 'Please check your score',
      };
      this.notiService.addNewNotificationForStudent(user, notification);
      return res.status(HttpStatus.OK).json(result);
    } else {
      throw new BadRequestException('Return homework Failed');
    }
  }

  @Post('/returnHomeworks/:id/a/:homeworkId')
  async returnHomeworks(@Res() res: any, @Param() params: any, @Body() body) {
    console.log('Returning multiple');
    const _id = params.id;
    const homeworkId = params.homeworkId;
    const teacherName = body.teacherName
    console.log(body)
    // console.log(_id);
    // console.log(homeworkId);

    const result = await this.classService.returnHomeworks(_id, homeworkId);

    if (result) {
      // await this.emailConfirmService.sendMultipleReturnHomeworkLink(
      //   result.className,
      //   result.homework,
      //   result.users,
      // );
      const users = result.users
      const homework = result.homework
      const classObject = result.classObject
      const notification = {
        name: teacherName + ` has returned homework ${homework.name}  in ` + classObject.className,
        url: '',
        content: 'Please check your score',
      };
    
      this.notiService.addNewNotificationForStudents(users, classObject, notification)

      return res.status(HttpStatus.OK).json(result);
    } else {
      throw new BadRequestException('Return homework Failed');
    }
  }

  @Get('/getHomeworks/:id')
  // @UseGuards(RefreshTokenGuard)
  async getClassHomework(@Param() params: any) {
    // console.log("get homework")
    const classId = params.id;
    return this.classService.getHomeworks(classId);
  }

  @Post('/addHomework/:id')
  async addHomework(@Body() body, @Param() params: any) {
    const homework = body;
    const id = params.id;
    return await this.classService.addHomeWork(id, homework);
  }
}
