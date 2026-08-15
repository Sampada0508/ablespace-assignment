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