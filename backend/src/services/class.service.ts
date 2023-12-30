/* eslint-disable prettier/prettier */
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { generateString } from 'src/helpers/random-string';
import { Class, ClassDocument } from 'src/model/class.schema';
import { GradeComposition } from 'src/model/grade-composition.schema';
import { Homework, HomeworkDocument } from 'src/model/homework.schema';
import { User, UserDocument } from 'src/user/model/user.schema';

export class ClassService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Homework.name) private homeworkModel: Model<HomeworkDocument>,
  ) {}

  async getAllClass(): Promise<Class[]> {
    const classes = await this.classModel.find();
    //console.log(classes);
    return classes;
  }

  async getByRealId(id: ObjectId): Promise<Class | any> {
    return await this.classModel.findById(id);
  }

  async getById(id: string): Promise<Class | any> {
    const classObject = await this.classModel
      .findById(id)
      .populate({
        path: 'members',
        select: 'firstName lastName state studentId',
        populate: {
          path: 'classes.classId classes.role',
          select: 'classId className',
        },
      })
      .populate({
        path: 'homeworks',
      })
      .exec();

    // console.log(classObject);
    return classObject;
  }

  async getMember(classId: string): Promise<User | any> {
    const classObject = await this.classModel
      .findOne({ classId: classId })
      .populate({
        path: 'members',
        select: 'firstName lastName state',
        populate: {
          path: 'classes.classId classes.role',
          select: 'classId className',
        },
      })
      .exec();

    return classObject.members;
  }

  async addClass(classObject: Class): Promise<Class | any> {
    const classId = generateString(6);
    const newClass = { ...classObject, classId: classId };
    // console.log(newClass);
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

  async addStudentViaDocument(id: ObjectId, students: [Student]) {
    const classObject = this.classModel.findById(id);
    if (classObject == null) {
      throw new NotFoundException('Class not found');
    }

    const saveStudents = students.map((s) => {
      const names = s.fullName.split(' ');
      const lastName = names.pop() || '';
      const firstName = names.join(' ');

      return {
        studentId: s.studentId,
        lastName: lastName,
        firstName: firstName,
        address: '',
        phone: '',
        roles: ['1000'],
        provider: 'local',
        providerId: '',
        refreshToken: '',
        accessToken: '',
        photo: '',
        state: 'not-activated',
        email: '',
        classes: [
          {
            classId: id,
            role: '1000',
          },
        ],
      };
    });

    return await this.userModel.insertMany(saveStudents);
  }

  async addStudent(classId: string, studentId: ObjectId) {
    //console.log(classId)
    const foundClass = await this.classModel.findOne({ classId: classId });
    //console.log(foundClass)
    if (!foundClass) {
      throw new NotFoundException('Class not existed');
    } else {
      await foundClass.populate('members');
      const user = await this.userModel.findById(studentId).populate({
        path: 'classes.classId',
        match: {
          classId: classId,
        },
      });
      // console.log(user);
      //console.log(foundClass)

      if (user.classes.length > 0) {
        throw new ForbiddenException('User already in the class');
      } else {
        foundClass.members.push(user);
        user.classes.push({ classId: foundClass._id, role: '1000' });
        await user.save();
        await foundClass.save();
      }
    }
  }

  async removeStudent(classId: string, studentId: ObjectId) {
    const foundClass = await this.classModel.findOne({ classId: classId });
    if (!foundClass) {
      throw new NotFoundException('Class not existed');
    } else {
      await foundClass.populate('members', '_id');
      await foundClass.populate('members');
      const user = await this.userModel.findById(studentId).populate({
        path: 'classes.classId',
        match: {
          classId: classId,
        },
      });
      if (user.classes.length > 0) {
        user.classes = user.classes.filter(
          (c) => (c.classId as Class).classId !== foundClass.classId,
        );
        foundClass.members = foundClass.members.filter(
          (member) =>
            member.email !== user.email && user.provider === member.provider,
        );
        foundClass.save();
        user.save();
      } else {
        throw new NotFoundException('User not in this class');
      }
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

  async getHomeworks(classId: ObjectId): Promise<Homework | any> {
    const homeworks = await this.homeworkModel
      .find({ courseId: classId })
      .exec();
    // console.log(homeworks);
    return homeworks;
  }

  async addHomeWork(id: string, homework: Homework) {
    const classObject = await this.classModel.findById(id);

    const objectId = new mongoose.Types.ObjectId(id);
    // console.log('adding homework');

    const newHomework = new this.homeworkModel({
      doneMembers: homework.doneMembers,
      homeworkState: homework.homeworkState,
      deadline: homework.deadline,
      name: homework.name,
      components: homework.components,
      maxScore: homework.maxScore,
      courseId: objectId,
    });

    classObject.homeworks.push(newHomework._id);
    await classObject.save();

    return await newHomework.save();
  }

  async returnHomework(classId: ObjectId, homeworkId: ObjectId, userId: ObjectId) {
    const foundHomework = await this.homeworkModel.findById(homeworkId);
    if (foundHomework === null) {
      throw new NotFoundException(
        'The homework is either deleted or not found',
      );
    }

    const foundUser = await this.userModel.findById(userId).exec();
    // console.log(foundUser);

    const updateUser = foundHomework.doneMembers.find((member) => {
      // console.log(member.memberId);
      return (
        (member.memberId as ObjectId).toString() == foundUser._id.toString()
      );
    });
    // console.log(foundHomework);
    // console.log(updateUser);

    updateUser.state = 'final';
    return await foundHomework.save();
  }

  async updateHomeworkScore(
    classId: ObjectId,
    newData: [UpdateHomework],
    homeworkId: ObjectId,
  ) {
    const classObject = await this.classModel.findById(classId);

    if (!classObject) {
      throw new NotFoundException('Class is either deleted or not existed');
    }

    const foundHomework = await this.homeworkModel.findById(homeworkId);

    if (!foundHomework) {
      throw new NotFoundException('Homework is either removed or not existed');
    }

    await classObject.populate({
      path: 'members',
      select: '_id studentId',
    });
    // console.log(classObject)

    await foundHomework.populate({
      path: 'doneMembers.memberId doneMembers.state doneMembers.score',
    });

    // console.log(foundHomework.doneMembers);

    const newDoneMembers = newData?.map((h) => {
      const { score, studentId, ...other } = h;

      console.log(studentId)
      const currentUser = classObject.members.find(
        (m) => m?.studentId == studentId.toString(),
      );

      // console.log(currentUser)

      const foundUserInHomework = foundHomework.doneMembers.find((m) => {
        return ((m.memberId as User)?._id).equals(currentUser?._id);
      });

      console.log(foundUserInHomework)

      let returnData;
      if (foundUserInHomework) {
        returnData = {
          state: foundUserInHomework?.state,
          score: score,
          memberId: foundUserInHomework?.memberId,
        }
      } else {
        returnData = {
          state: 'pending',
          score: score,
          memberId: currentUser?._id
        }
      }
      return returnData;
    });

    
    newDoneMembers.filter((n) => n != null)
    // console.log(newDoneMembers);
    foundHomework.doneMembers = newDoneMembers
    // console.log(foundHomework.doneMembers)
    return await foundHomework.save();
  }

  async updateHomework(newData: UpdateHomework, id: ObjectId) {
    const foundHomework = await this.homeworkModel.findById(newData._id);
    if (foundHomework === null) {
      throw new NotFoundException(
        'The homework is either deleted or not found',
      );
    }

    const foundUser = await this.userModel.findById(newData.memberId).exec();
    // console.log(foundUser);

    const updateUser = foundHomework.doneMembers.find((member) => {
      // console.log(member.memberId);
      return (
        (member.memberId as ObjectId).toString() == foundUser._id.toString()
      );
    });
    // console.log(foundHomework);
    // console.log(updateUser);

    if (updateUser) {
      updateUser.score = newData.score;
      updateUser.state = newData.state;
    } else {
      foundHomework.doneMembers.push({
        memberId: newData.memberId,
        score: newData.score,
        state: 'pending',
      });
    }
    return foundHomework.save();
  }
}
