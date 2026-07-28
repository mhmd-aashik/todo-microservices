import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
