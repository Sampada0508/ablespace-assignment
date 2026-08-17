import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ProjectPriority } from '../schemas/project.schema';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  @MaxLength(150)
  name?: string;

  @IsEnum(ProjectPriority)
  @IsOptional()
  priority?: ProjectPriority;

  @IsString()
  @IsOptional()
  lead?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
