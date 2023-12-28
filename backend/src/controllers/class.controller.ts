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
  @UseGuards(RefreshTokenGuard)
  async joinClass(@Req() req, @Param() params : any){
    console.log("joining class")
    const user = req.user;
    const classId = params.classId
    return this.classService.addStudent(classId, user._id);
  }

  @Put('/addStudent/:classId')
  @UseGuards(RefreshTokenGuard, RolesGuard)
  @Roles(UserRoles.admin, UserRoles.teacher)
  async addStudentToClass(@Req() req, @Param() params: any) {
    const user = req.user;
    const classId = params.id
    return this.classService.addStudent(classId, user._id);
  }

  @Post('/removeStudent/:studentId')
  @UseGuards(RefreshTokenGuard, RolesGuard)
  @Roles(UserRoles.admin, UserRoles.teacher)
  async removeStudent(@Req() req, @Param() params: any) {
    const classObject = req.class;
    return this.classService.removeStudent(classObject.id, params.studentId);
  }

  @Post('/updateComposition/:id')
  @UseGuards(RefreshTokenGuard, RolesGuard)
  @Roles(UserRoles.admin, UserRoles.teacher)
  async updateComposition(@Req() req, @Param() params: any) {
    const composition = req.composition;
    return this.classService.updateComposition(params.id, composition);
  }

  @Post('/updateHomework/:id')
  async updateHomework(@Req() request, @Param() params: any){
    const newData = request.updateData
    const id = params.id

    return this.classService.updateHomework(newData, id)
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
