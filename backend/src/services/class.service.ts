/* eslint-disable prettier/prettier */
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { generateString } from 'src/helpers/random-string';
import { Class, ClassDocument } from 'src/model/class.schema';
import { GradeComposition } from 'src/model/grade-composition.schema';
import { ClassesModule } from 'src/modules/class.module';
import { User } from 'src/user/model/user.schema';

export class ClassService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
  ) {}

  async getAllClass(): Promise<Class[]> {
    const classes = await this.classModel.find();
    console.log(classes);
    return classes;
  }

  async getByRealId(id: ObjectId): Promise<Class | any> {
    return await this.classModel.findById(id);
  }

  async getById(id: string): Promise<Class | any> {
    const classObject = await this.classModel
      .findOne({ classId: id })
      .exec();
    
    return classObject;
  }

  async getMember(classId: string): Promise<User | any > {
    const classObject = await this.classModel
      .findOne({ classId: classId })
      .populate({
        path: 'members',
        select: 'firstName lastName state',
        populate : {path: 'classes.classId classes.role', select: 'classId className'}
      })
      .exec();

    return classObject.members
  }

  async addClass(classObject: Class): Promise<Class | any> {
    const classId = generateString(7);
    const newClass = { ...classObject, classId: classId };
    return await this.classModel.create(newClass);
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
