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

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
  ) {}

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.create(
      createProjectDto,
    );
  }

  @Get()
  async findAll(
    @Query('userId') userId: string,
  ) {
    return this.projectsService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    return this.projectsService.findOne(
      id,
      userId,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(
      id,
      userId,
      updateProjectDto,
    );
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    await this.projectsService.remove(
      id,
      userId,
    );

    return {
      message: 'Project deleted successfully',
    };
  }
}
