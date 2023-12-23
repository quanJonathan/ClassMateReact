/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
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
    return this.classService.addClass(classObject);
  }

  @Post('/generateAccessLink/:id')
  async generateAndReturn(@Param() params: any) {
    return this.classService.generateAccessLink(params.id);
  }

  @Put('/addStudent/:studentId')
  @UseGuards(RefreshTokenGuard, RolesGuard)
  @Roles(UserRoles.admin, UserRoles.teacher)
  async addStudentToClass(@Req() req, @Param() params: any) {
    const classObject = req.class;
    return this.classService.addStudent(classObject.id, params.studentId);
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
}
