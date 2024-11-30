import { IsString, IsObject, IsOptional } from 'class-validator';
import { ThemeProps } from 'src/types';

export class UpdateBoardDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsObject()
  @IsOptional()
  theme?: ThemeProps;
}
