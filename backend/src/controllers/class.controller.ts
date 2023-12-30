/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { asyncScheduler } from 'rxjs';
import { Roles } from 'src/authorization/roles.decorator';
import { RolesGuard } from 'src/authorization/roles.guard';
import { UserRoles } from 'src/enum/userRole.enum';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import { ClassService } from 'src/services/class.service';

@Controller('class')
export class ClassController {
  constructor(private classService: ClassService) {}

  @Get('/all')
  async getAll() {
    return this.classService.getAllClass();
  }

  @Get('/:id')
  async getByRealId(@Param() params: any) {
    return this.classService.getByRealId(params.id);
  }

  @Get('/getClass/:id')
  async getById(@Param() params: any){
    //console.log("get class")
    return this.classService.getById(params.id)
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

  @Post('/generateAccessLink/:id')
  async generateAndReturn(@Param() params: any) {
    return this.classService.generateAccessLink(params.id);
  }

  @Post('/joinClass/:classId')
  // @UseGuards(RefreshTokenGuard)
  async joinClass(@Body() body, @Param() params : any){
    console.log("joining class")
    const user = body;
    const classId = params.classId
    console.log(classId)
    return this.classService.addStudent(classId, user._id);
  }

  @Post('/joinClassAsTeacher/:classId')
  @UseGuards(RefreshTokenGuard)
  async joinClassAsTeacher(@Req() req, @Param() params : any){
    console.log("joining class")
    const user = req.user;
    const classId = params.classId
    console.log(classId)
    return this.classService.addTeacher(classId, user._id);
  }

  @Put('/addStudent/:classId')
  @UseGuards(RefreshTokenGuard, RolesGuard)
  @Roles(UserRoles.admin, UserRoles.teacher)
  async addStudentToClass(@Req() req, @Param() params: any) {
    const user = req.user;
    const classId = params.id
    return this.classService.addStudent(classId, user._id);
  }

  @Post('/addStudents/:classId')
  // @UseGuards(RefreshTokenGuard)
  async addStudentsToClass(@Body() body, @Param() params: any) {
    console.log("adding multiple user")
    const students = body
    console.log(students)
    const classId = params.id
    return this.classService.addStudentViaDocument(classId, students);
  }

  @Post('/removeStudent/:studentId')
  // @UseGuards(RefreshTokenGuard, RolesGuard)
  // @Roles(UserRoles.admin, UserRoles.teacher)
  async removeStudent(@Req() req, @Body() body: { id: string}, @Param() params: any) {
    console.log(body.id);
    return this.classService.removeStudent(body.id, params.studentId);
  }

  @Post('/updateComposition/:id')
  @UseGuards(RefreshTokenGuard, RolesGuard)
  @Roles(UserRoles.admin, UserRoles.teacher)
  async updateComposition(@Req() req, @Param() params: any) {
    const composition = req.composition;
    return this.classService.updateComposition(params.id, composition);
  }

  @Post('/updateHomework/:id')
  async updateHomework(@Body() body, @Param() params: any){
    const newData = body
    const id = params.id
    console.log(id)
    console.log(newData)

    return this.classService.updateHomework(newData, id)
  }

  @Post('returnHomework/:id')
  async returnHomework(@Body() body, @Param() params: any){
    const _id= params.id
    const homework = body

    return this.classService.returnHomework(_id, homework)
  }

  @Get('/getHomeworks/:id')
  //@UseGuards(RefreshTokenGuard)
  async getClassHomework(@Param() params: any){
    console.log("get homework")
    const classId = params.id
    return this.classService.getHomeworks(classId)
  }

  @Post('/addHomework/:id')
  async addHomework(@Body() body, @Param() params: any){
    const homework = body
    const id = params.id
    return await this.classService.addHomeWork(id, homework)
  }
}
