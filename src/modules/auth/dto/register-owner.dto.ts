import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class RegisterOwnerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber('IN')
  phone?: string;

  @IsString()
  @MinLength(8)
  password: string;
}
