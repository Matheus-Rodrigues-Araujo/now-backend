import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class AddUsersToProjectDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  usersIds: number[];
}
