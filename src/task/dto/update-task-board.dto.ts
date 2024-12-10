import { IsInt, IsOptional } from 'class-validator';

export class UpdateTaskBoardDto {
  @IsInt()
  id: number;

  @IsInt()
  boardId: number;

  @IsInt()
  previousBoardId: number;

  @IsInt()
  order: number;

  @IsInt()
  previousOrder: number;
}
