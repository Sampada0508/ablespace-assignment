import { UpdateTaskDto } from './dto/update-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
  const task = new this.taskModel({
    ...createTaskDto,
    userId: new Types.ObjectId(createTaskDto.userId),
    dueDate: createTaskDto.dueDate
      ? new Date(createTaskDto.dueDate)
      : undefined,
  });

  return task.save();
}

  async findAll(userId: string): Promise<TaskDocument[]> {
  return this.taskModel
    .find({ userId: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .exec();
}

  async findOne(id: string, userId: string): Promise<TaskDocument> {
  const task = await this.taskModel.findOne({
    _id: new Types.ObjectId(id),
    userId: new Types.ObjectId(userId),
  });

  if (!task) {
    throw new NotFoundException('Task not found');
  }

  return task;
}

  async update(
  id: string,
  userId: string,
  updateData: UpdateTaskDto,
): Promise<TaskDocument> {
  const task = await this.taskModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    },
    {
      ...updateData,
      ...(updateData.dueDate && {
        dueDate: new Date(updateData.dueDate),
      }),
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!task) {
    throw new NotFoundException('Task not found');
  }

  return task;
}
  

 async remove(id: string, userId: string): Promise<void> {
  const result = await this.taskModel.deleteOne({
    _id: new Types.ObjectId(id),
    userId: new Types.ObjectId(userId),
  });

  if (result.deletedCount === 0) {
    throw new NotFoundException('Task not found');
  }
}
}