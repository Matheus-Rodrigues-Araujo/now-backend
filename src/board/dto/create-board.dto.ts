import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsInt, IsJSON, IsObject } from 'class-validator';
import { ThemeProps } from 'src/types';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsObject()
  @IsNotEmpty()
  theme: ThemeProps;

  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  projectId: number;
}
