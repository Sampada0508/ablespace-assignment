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
  


  async createUpdate(
    taskId: string,
    userId: string,
    text: string,
    userName: string,
  ) {
    const task = await this.findOne(taskId, userId);

    if (!task.updates) {
      task.updates = [];
    }

    task.updates.push({
      text: text.trim(),
      userName,
      createdAt: new Date(),
    } as any);

    await task.save();

    return task.updates[task.updates.length - 1];
  }

  async createSubtask(
    taskId: string,
    userId: string,
    subtaskData: {
      title: string;
      priority?: string;
      dueDate?: string;
    },
  ) {
    const task = await this.findOne(taskId, userId);

    if (!task.subtasks) {
      task.subtasks = [];
    }

    task.subtasks.push({
      title: subtaskData.title,
      priority: (subtaskData.priority as any) || 'medium',
      dueDate: subtaskData.dueDate
        ? new Date(subtaskData.dueDate)
        : undefined,
      completed: false,
    } as any);

    await task.save();

    return task.subtasks[task.subtasks.length - 1];
  }

  async updateSubtask(
    taskId: string,
    subtaskId: string,
    userId: string,
    updateData: {
      title?: string;
      priority?: string;
      dueDate?: string;
      completed?: boolean;
    },
  ) {
    const task = await this.findOne(taskId, userId);

    if (!task.subtasks) {
      throw new NotFoundException('Subtask not found');
    }

    const subtask = task.subtasks.find(
      (item: any) =>
        item._id.toString() === subtaskId,
    );

    if (!subtask) {
      throw new NotFoundException('Subtask not found');
    }

    if (updateData.title !== undefined) {
      subtask.title = updateData.title;
    }

    if (updateData.priority !== undefined) {
      subtask.priority = updateData.priority as any;
    }

    if (updateData.dueDate !== undefined) {
      subtask.dueDate = updateData.dueDate
        ? new Date(updateData.dueDate)
        : undefined;
    }

    if (updateData.completed !== undefined) {
      subtask.completed = updateData.completed;
    }

    await task.save();

    return subtask;
  }

  async deleteSubtask(
    taskId: string,
    subtaskId: string,
    userId: string,
  ) {
    const task = await this.findOne(taskId, userId);

    if (!task.subtasks) {
      throw new NotFoundException('Subtask not found');
    }

    const subtaskIndex = task.subtasks.findIndex(
      (item: any) =>
        item._id.toString() === subtaskId,
    );

    if (subtaskIndex === -1) {
      throw new NotFoundException('Subtask not found');
    }

    task.subtasks.splice(subtaskIndex, 1);

    await task.save();

    return {
      message: 'Subtask deleted successfully',
    };
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