/* eslint-disable prettier/prettier */
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Class, ClassDocument } from 'src/model/class.schema';
import { GradeComposition } from 'src/model/grade-composition.schema';
import { ClassesModule } from 'src/modules/class.module';
import { User } from 'src/user/model/user.schema';

export class ClassService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
  ) {}

  async getAllClass(): Promise<Class[]>{
    return await this.classModel.find();
  }

  async getByRealId(id: ObjectId): Promise<Class | any> {
    return await this.classModel.findById(id);
  }

  async getById(id: string): Promise<Class | any> {
    return await this.classModel.find({ classId: id }).exec();
  }

  async addClass(classObject: Class): Promise<Class | any> {
    return await this.classModel.create(classObject);
  }

  async generateAccessLink(id: ObjectId): Promise<string> {
    const foundClass = await this.classModel.findById(id);

    if (!foundClass) {
      throw new NotFoundException('Class not existed');
    } else {
      if ((foundClass as Class).accessLink) {
        return foundClass.accessLink;
      } else {
        const accessLink = `http:/localhost:3001/${foundClass.classId}/`;
        const updatedClass = { ...foundClass, accessLink };
        await this.classModel
          .updateOne({ id: id }, { accessLink: accessLink })
          .exec();
        return accessLink;
      }
    }
  }

  async addStudent(classId: ObjectId, studentID: ObjectId) {
    const foundClass = await this.classModel.findById(classId);
    if (!foundClass) {
      throw new NotFoundException('Class not existed');
    } else {
      // await foundClass.populate('members');
      // const members = foundClass.members;
      // if (members.includes(studentID)) {
      //   console.log('User existed');
      // } else {
      //   foundClass.members.push(studentID);
      //   await foundClass.save();
      // }
    }
  }

  async removeStudent(classId: ObjectId, studentID: ObjectId) {
    const foundClass = await this.classModel.findById(classId);
    if (!foundClass) {
      throw new NotFoundException('Class not existed');
    } else {
      await foundClass.populate('members', '_id');
      const members = foundClass.members;
      // if (members.includes(studentID)) {
      //   foundClass.members.filter((obj) => obj !== studentID);
      //   await foundClass.save();
      // } else {
      //   console.log('user not existed');
      // }
    }
  }

  async updateComposition(
    classId: ObjectId,
    GradeComposition: GradeComposition,
  ) {
    const foundCompostion = await this.classModel
      .findById(classId)
      .populate('compostion');
  }
}
