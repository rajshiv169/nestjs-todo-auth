import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoDto {
  @ApiProperty({
    example: 'Updated todo title',
    description: 'The updated title of the todo',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Updated description',
    description: 'The updated description of the todo',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the todo is completed',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}