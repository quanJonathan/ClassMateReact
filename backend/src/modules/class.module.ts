/* eslint-disable prettier/prettier */
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from 'src/model/class.schema';
import { ClassService } from 'src/services/class.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
  ],
  providers: [ClassService],
  exports: [ClassService],
})
export class ClassesModule {}
