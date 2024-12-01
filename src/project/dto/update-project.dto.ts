import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
