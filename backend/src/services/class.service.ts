/* eslint-disable prettier/prettier */
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt } from 'bcrypt';
import mongoose, { Model, Mongoose, ObjectId } from 'mongoose';
import { hashData } from 'src/helpers/hash-data';
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
    @InjectModel(GradeComposition.name)
    private gradeCompositionModel: Model<GradeComposition>,
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
        select: 'firstName lastName state studentId email',
        populate: {
          path: 'classes.classId classes.role',
          select: 'classId className description',
        },
      })
      .populate({
        path: 'homeworks',
        populate: {
          path: 'composition',
        },
      })
      .populate({
        path: 'compositions',
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
          select: 'classId className description',
        },
      })
      .exec();

    return classObject.members;
  }

  async addClass(classObject: Class): Promise<Class | any> {
    const classId = generateString(6);
    const newClass = { ...classObject, classId: classId, state: 'active' };
    // console.log(newClass);
    return await this.classModel.create(newClass);
  }

  async updateState(classObject: Class) {
    return await this.classModel.findOneAndUpdate(
      { classId: classObject.classId },
      {
        $set: {
          state: classObject.state,
        },
      },
    );
  }

  async getByClassId(classId: ObjectId): Promise<Class | any> {
    return await this.classModel.findOne({ classId: classId });
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
    const classObject = await this.classModel.findById(id);
    if (classObject == null) {
      throw new NotFoundException('Class not found');
    }

    const unifiedPass = await hashData('123456');

    const saveStudents = students.map((s) => {
      const names = s.fullName.split(' ');
      const lastName = names.pop() || '';
      const firstName = names.join(' ');

      return {
        _id: new mongoose.Types.ObjectId(),
        studentId: s.studentId,
        lastName: lastName,
        firstName: firstName,
        password: unifiedPass,
        photo: '',
        address: '',
        phoneNumber: '',
        roles: ['1000'],
        provider: 'local',
        providerId: '',
        refreshToken: '',
        accessToken: '',
        state: 'not-activated',
        email: '',
        createdDate: new Date(Date.now()),
        classes: [
          {
            classId: classObject._id,
            role: '1000',
          },
        ],
      };
    });

    classObject.members.push(...saveStudents);
    await classObject.save();
    return await this.userModel.insertMany(saveStudents);
  }

  async addStudent(classId: string, studentId: ObjectId) {
    console.log(classId)
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


  async addTeacher(classId: string, studentId: ObjectId) {
    console.log(classId)
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
      console.log(user);
      //console.log(foundClass)

      if (user.classes.length > 0) {
        throw new ForbiddenException('User already in the class');
      } else {
        foundClass.members.push(user);
        user.classes.push({ classId: foundClass._id, role: '3000' });
        await user.save();
        await foundClass.save();
      }
    }
  }

  async removeStudent(classId: string, studentId: ObjectId) {
    const foundClass = await this.classModel.findById(classId);
   
    if (!foundClass) {
      throw new NotFoundException('Class not existed');
    } else {
      // await foundClass.populate('members', '_id');
      const classFound = await foundClass.populate('members');
      console.log(classFound);
      const user = await this.userModel.findById(studentId).populate({
        path: 'classes',
        match: {
          classId: classId,
        },
      });

      console.log(user);
      if (user.classes.length > 0) {
        user.classes = user.classes.filter(
          (c) => { c.classId.toString()   !== foundClass.classId  }
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
    gradeCompositions: UpdateGradeComposition[],
  ) {
    try {
      const foundClass = await this.classModel.findById(classId);

      if (!foundClass) {
        throw new NotFoundException('Class is not existed or deleted');
      }

      console.log(foundClass);

      if (!gradeCompositions) return;

      console.log(gradeCompositions);

      for (const gradeComposition of gradeCompositions) {
        const existingComposition = foundClass.compositions.find((comp) =>
          comp._id.equals(gradeComposition._id),
        );

        if (!existingComposition) {
          const newGradeComposition = new this.gradeCompositionModel({
            _id: new mongoose.Types.ObjectId(),
            courseId: foundClass,
            homeworks: [],
            name: gradeComposition.name,
            gradeScale: gradeComposition.gradeScale,
          });
          console.log(newGradeComposition);
          await newGradeComposition.save();
          (foundClass.compositions as mongoose.Types.ObjectId[]).push(
            newGradeComposition._id,
          );
          await foundClass.save();
        } else {
          console.log(existingComposition);
          if (gradeComposition.isDelete) {
            console.log('deleting');
            foundClass.compositions = foundClass.compositions.filter(
              (c) => !c._id.equals(gradeComposition._id),
            ) as mongoose.Types.ObjectId[];
            await this.homeworkModel.updateMany(
              { composition: gradeComposition },
              { composition: null },
            );
            await this.gradeCompositionModel.findOneAndDelete({
              _id: gradeComposition._id,
            });
            await foundClass.save();
          } else {
            await this.gradeCompositionModel.findOneAndUpdate(
              { _id: existingComposition._id },
              {
                name: gradeComposition.name,
                gradeScale: gradeComposition.gradeScale,
              },
            );
          }
        }
      }
      return gradeCompositions.filter((g) => g.isDelete == false);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getHomeworks(classId: ObjectId): Promise<Homework | any> {
    const homeworks = await this.homeworkModel
      .find({ courseId: classId })
      .exec();
    // console.log(homeworks);
    return homeworks;
  }

  async getHomeworkById(homeworkId: any): Promise<Homework> {
    const foundHomework = await this.homeworkModel
      .findById(homeworkId)
      .select('-deadline -doneMembers -components -homeworkState -_id')
      .exec();

    return foundHomework;
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

  async returnHomework(
    classId: ObjectId,
    homeworkId: ObjectId,
    userId: ObjectId,
  ) {
    const foundHomework = await this.homeworkModel.findById(homeworkId);
    if (foundHomework === null) {
      throw new NotFoundException(
        'The homework is either deleted or not found',
      );
    }

    const className = (await this.classModel.findById(classId)).className;
    const foundUser = await this.userModel.findById(userId).exec();
    // console.log(foundUser);

    await foundHomework.populate({
      path: 'doneMembers.memberId doneMembers.state doneMembers.score',
      select: 'email _id',
    });
    const updateUser = foundHomework.doneMembers.find((member) => {
      // console.log(member.memberId);
      return (
        (member.memberId as User)._id.toString() == foundUser._id.toString()
      );
    });
    // console.log(foundHomework);
    // console.log(updateUser);

    updateUser.state = 'final';
    await foundHomework.save();

    console.log(foundHomework.courseId);
    console.log(updateUser);
    // console.log()
    return {
      user: updateUser,
      className: className,
      homework: {
        state: foundHomework.homeworkState,
        maxScore: foundHomework.maxScore,
        name: foundHomework.name,
      },
    };
  }

  async returnHomeworks(_id: ObjectId, homeworkId: ObjectId) {
    const foundHomework = await this.homeworkModel
      .findById(homeworkId)
      .populate('doneMembers.memberId');
    if (foundHomework === null) {
      throw new NotFoundException(
        'The homework is either deleted or not found',
      );
    }
    const foundClass = await this.classModel.findById(_id).populate('members');
    const users = foundClass.members;

    users.map((u) => {
      const role = u.classes.find((c) =>  (c.classId as Class)._id.equals(foundClass._id)).role
      if(role == '3000') return
      const user = foundHomework.doneMembers.find((d) =>
        u._id.equals((d.memberId as User)._id)
      );
      if (!user) {
        foundHomework.doneMembers.push({
          memberId: u,
          state: 'final',
          score: 0,
        });
      } else {
        user.state = 'final';
      }
    });

    await foundHomework.save();

    return {
      users: foundHomework.doneMembers,
      className: foundClass.className,
      homework: {
        state: foundHomework.homeworkState,
        maxScore: foundHomework.maxScore,
        name: foundHomework.name,
      },
    };
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

      console.log(studentId);
      const currentUser = classObject.members.find(
        (m) => m?.studentId == studentId.toString(),
      );

      // console.log(currentUser)

      const foundUserInHomework = foundHomework.doneMembers.find((m) => {
        return ((m.memberId as User)?._id).equals(currentUser?._id);
      });

      // console.log(foundUserInHomework);

      let returnData;
      if (foundUserInHomework) {
        returnData = {
          state: foundUserInHomework?.state,
          score: score,
          memberId: foundUserInHomework?.memberId,
        };
      } else {
        returnData = {
          state: 'pending',
          score: score,
          memberId: currentUser?._id,
        };
      }
      return returnData;
    });

    newDoneMembers.filter((n) => n != null);
    // console.log(newDoneMembers);
    foundHomework.doneMembers = newDoneMembers;
    // console.log(foundHomework.doneMembers)
    await foundHomework.save();

    return 'Save successfully';
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
