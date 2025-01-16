import { IsInt, IsOptional } from 'class-validator';

export class UpdateTaskOrderDto {
  @IsInt()
  id: number;

  @IsInt()
  order: number;
}
