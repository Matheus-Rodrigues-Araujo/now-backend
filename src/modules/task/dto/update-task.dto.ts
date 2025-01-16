import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

enum Task_Level {
  USER = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXTREME = 'EXTREME',
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate: Date;

  @IsEnum(Task_Level)
  @IsOptional()
  level?: Task_Level;
}
