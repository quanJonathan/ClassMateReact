/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
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

  @Get('/:classId')
  async getById(@Param() params: any) {
    return this.classService.getById(params.classId);
  }

  @Post('/addClass')
  async addClass(@Req() request) {
    const classObject = request.class;
    return this.classService.addClass(classObject);
  }

  @Post('/generateAccessLink/:id')
  async generateAndReturn(@Param() params: any) {
    return this.classService.generateAccessLink(params.id);
  }

  @Put('/addStudent/:studentId')
  async addStudentToClass(@Req() req, @Param() params: any) {
    const classObject = req.class;
    return this.classService.addStudent(classObject.id, params.studentId);
  }

  @Post('/removeStudent/:studentId')
  async removeStudent(@Req() req, @Param() params: any) {
    const classObject = req.class;
    return this.classService.removeStudent(classObject.id, params.studentId);
  }

  @Post('/updateComposition/:id')
  async updateComposition(@Req() req, @Param() params: any) {
    const composition = req.composition;
    return this.classService.updateComposition(params.id, composition);
  }
}
