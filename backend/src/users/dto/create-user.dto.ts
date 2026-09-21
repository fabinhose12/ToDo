import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail({}, { message: 'Forneça um e-mail válido' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'A palavra-passe deve ter pelo menos 6 caracteres' })
  password: string;
}