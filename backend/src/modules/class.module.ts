/* eslint-disable prettier/prettier */
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from 'src/model/class.schema';
import { ClassService } from 'src/services/class.service';
import { Module } from '@nestjs/common';
import { User, UserSchema } from 'src/user/model/user.schema';
import { Homework, HomeworkSchema } from 'src/model/homework.schema';
import { GradeComposition, GradeCompositionSchema } from 'src/model/grade-composition.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Homework.name, schema: HomeworkSchema },
    ]),
    MongooseModule.forFeature([
      { name: GradeComposition.name, schema: GradeCompositionSchema },
    ]),
  ],
  providers: [ClassService],
  exports: [ClassService],
})
export class ClassesModule {}
