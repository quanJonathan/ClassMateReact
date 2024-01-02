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
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import { ClassService } from 'src/services/class.service';

@Controller('class')
export class ClassController {
  constructor(
    private classService: ClassService,
    private emailConfirmService: EmailConfirmationService,
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
  async addClass(@Body() body) {
    const classObject = body;
    // console.log(body)
    return this.classService.addClass(classObject);
  }

  
  
  @Get('/getOne/:id')
  async getClassId(@Param() params: any) {
    //console.log("get class")
    //console.log(params)
    return await this.classService.getByClassId(params.id);
  }

  @Post('/updateState/')
  async updateState(@Body() body) {
    console.log(body)
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

  @Post('/joinClass/:classId')
  // @UseGuards(RefreshTokenGuard)
  async joinClass(@Body() body, @Param() params: any) {
    // console.log("joining class")
    const user = body;
    const classId = params.classId;
    return this.classService.addStudent(classId, user._id);
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
  @UseGuards(RefreshTokenGuard)
  async addStudentsToClass(@Body() body, @Param() params: any) {
    console.log("adding multiple user")
    const students = body;
    console.log(students)
    const classId = params.classId;
    return this.classService.addStudentViaDocument(classId, students);
  }

  @Post('/removeStudent/:studentId')
  @UseGuards(RefreshTokenGuard, RolesGuard)
  @Roles(UserRoles.admin, UserRoles.teacher)
  async removeStudent(@Req() req, @Param() params: any) {
    const classObject = req.class;
    return this.classService.removeStudent(classObject.id, params.studentId);
  }

  @Post('/updateOrAddGradeCompositions/:id')
  // @UseGuards(RefreshTokenGuard)
  async updateComposition(@Req() req, @Param() params: any) {
    console.log("Updating grade compositions")
    const compositions = req.body;
    return this.classService.updateComposition(params.id, compositions);
  }

  @Post('/updateHomeworkScore/:id/a/:homeworkId')
  @UseGuards(RefreshTokenGuard)
  async updateHomeworkScore(@Body() body, @Param() params: any, @Res() response: any) {
    console.log('Updating score');
    const _id = params.id;
    const homeworkId = params.homeworkId;

    const homeworks = body;
    console.log(homeworks);
    const result = this.classService.updateHomeworkScore(
      _id,
      homeworks,
      homeworkId,
    );

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
  async returnHomework(@Body() body, @Param() params: any) {
    console.log("Returning")
    const _id = params.id;
    const userId = body.userId;
    const homeworkId = params.homeworkId

    console.log(_id)
    console.log(userId)
    console.log(homeworkId)

    const result = await this.classService.returnHomework(_id, homeworkId, userId);

    if(result){
      this.emailConfirmService.sendReturnHomeworkLink(result.user, result.className, result.homework)
    }else{
      throw new BadRequestException("Return homework Failed")
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
