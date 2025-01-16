import { IsInt } from 'class-validator';

export class MoveTaskDto {
  @IsInt()
  newBoardId: number;

  @IsInt()
  order: number;

  @IsInt()
  previousOrder: number;
}
