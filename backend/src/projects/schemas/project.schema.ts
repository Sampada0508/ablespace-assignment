import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Schema({ timestamps: true })
export class Project {
  @Prop({
    required: true,
    trim: true,
    maxlength: 150,
  })
  name: string;

  @Prop({
    enum: ProjectPriority,
    default: ProjectPriority.MEDIUM,
  })
  priority: ProjectPriority;

  @Prop({
    required: true,
    trim: true,
  })
  lead: string;

  @Prop()
  dueDate?: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;
}

export const ProjectSchema =
  SchemaFactory.createForClass(Project);
