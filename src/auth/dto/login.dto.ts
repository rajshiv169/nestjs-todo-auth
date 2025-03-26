import { IsEmail, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: false,
    description: 'Whether to keep the user logged in for 30 days',
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}