import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class FindProjectDto {
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  id?: number;

  @IsString()
  @IsOptional()
  title?: string;
}
