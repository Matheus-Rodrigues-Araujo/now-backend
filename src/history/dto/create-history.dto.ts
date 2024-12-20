import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Entity_Type, Action_Type } from 'src/types';

export class CreateHistoryDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Entity_Type)
  entityType: Entity_Type;

  @IsEnum(Action_Type)
  actionType: Action_Type;
}
