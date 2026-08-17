import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { TaskPriority } from '../schemas/task.schema';

export class UpdateSubtaskDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  title?: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
