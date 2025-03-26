import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({
    example: 'Buy groceries',
    description: 'The title of the todo',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Milk, eggs, bread',
    description: 'Optional description of the todo',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}