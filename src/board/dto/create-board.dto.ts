import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsInt, IsJSON, IsObject } from 'class-validator';

type themeObject = {
  backgroundColor?: string;
  color?: string;
};

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsObject()
  @IsNotEmpty()
  theme: themeObject;

  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  projectId: number;
}
