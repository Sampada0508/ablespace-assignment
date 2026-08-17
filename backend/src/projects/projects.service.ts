import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Project,
  ProjectDocument,
} from './schemas/project.schema';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectDocument> {
    const project = new this.projectModel({
      ...createProjectDto,

      userId: new Types.ObjectId(
        createProjectDto.userId,
      ),

      dueDate: createProjectDto.dueDate
        ? new Date(createProjectDto.dueDate)
        : undefined,
    });

    return project.save();
  }

  async findAll(
    userId: string,
  ): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({
        userId: new Types.ObjectId(userId),
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(
    id: string,
    userId: string,
  ): Promise<ProjectDocument> {
    const project =
      await this.projectModel.findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      });

    if (!project) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    return project;
  }

  async update(
    id: string,
    userId: string,
    updateData: UpdateProjectDto,
  ): Promise<ProjectDocument> {
    const project =
      await this.projectModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          userId: new Types.ObjectId(userId),
        },
        {
          ...updateData,

          ...(updateData.dueDate !== undefined && {
            dueDate: updateData.dueDate
              ? new Date(updateData.dueDate)
              : undefined,
          }),
        },
        {
          new: true,
          runValidators: true,
        },
      );

    if (!project) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    return project;
  }

  async remove(
    id: string,
    userId: string,
  ): Promise<void> {
    const result =
      await this.projectModel.deleteOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      });

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        'Project not found',
      );
    }
  }
}
