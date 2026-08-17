import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAll(@Query('userId') userId: string) {
    return this.tasksService.findAll(userId);
  }


  @Post(':id/updates')
  async createUpdate(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() body: {
      text: string;
      userName: string;
    },
  ) {
    return this.tasksService.createUpdate(
      id,
      userId,
      body.text,
      body.userName,
    );
  }

  @Post(':id/subtasks')
  async createSubtask(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() createSubtaskDto: CreateSubtaskDto,
  ) {
    return this.tasksService.createSubtask(
      id,
      userId,
      createSubtaskDto,
    );
  }

  @Patch(':id/subtasks/:subtaskId')
  async updateSubtask(
    @Param('id') id: string,
    @Param('subtaskId') subtaskId: string,
    @Query('userId') userId: string,
    @Body() updateSubtaskDto: UpdateSubtaskDto,
  ) {
    return this.tasksService.updateSubtask(
      id,
      subtaskId,
      userId,
      updateSubtaskDto,
    );
  }

  @Delete(':id/subtasks/:subtaskId')
  async deleteSubtask(
    @Param('id') id: string,
    @Param('subtaskId') subtaskId: string,
    @Query('userId') userId: string,
  ) {
    return this.tasksService.deleteSubtask(
      id,
      subtaskId,
      userId,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    return this.tasksService.findOne(id, userId);
  }

  @Patch(':id')
async update(
  @Param('id') id: string,
  @Query('userId') userId: string,
  @Body() updateTaskDto: UpdateTaskDto,
) {
  return this.tasksService.update(id, userId, updateTaskDto);
}

@Delete(':id')
async remove(
  @Param('id') id: string,
  @Query('userId') userId: string,
) {
  await this.tasksService.remove(id, userId);

  return {
    message: 'Task deleted successfully',
  };
}
}