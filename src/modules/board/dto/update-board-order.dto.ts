import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class UpdateBoardOrder {
  @IsInt()
  id: number;

  @IsInt()
  order: number;
}
