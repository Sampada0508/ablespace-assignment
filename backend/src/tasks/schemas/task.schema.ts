import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  ON_HOLD = 'on-hold',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Schema()
export class Subtask {
  @Prop({ required: true, trim: true, maxlength: 100 })
  title: string;

  @Prop({
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Prop()
  dueDate?: Date;

  @Prop({ default: false })
  completed: boolean;
}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);

@Schema()
export class Resource {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, trim: true })
  url: string;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);

@Schema()
export class TaskUpdate {
  @Prop({ required: true, trim: true, maxlength: 500 })
  text: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TaskUpdateSchema =
  SchemaFactory.createForClass(TaskUpdate);

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({
    required: true,
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Prop({
    required: true,
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Prop()
  dueDate?: Date;

  @Prop({
    type: [String],
    default: [],
  })
  labels: string[];

  @Prop({
    type: [SubtaskSchema],
    default: [],
  })
  subtasks: Subtask[];

  @Prop({
    type: [ResourceSchema],
    default: [],
  })
  resources: Resource[];

  @Prop({
    type: [TaskUpdateSchema],
    default: [],
  })
  updates: TaskUpdate[];

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);