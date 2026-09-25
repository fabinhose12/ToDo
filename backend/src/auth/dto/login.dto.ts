import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Por favor, insira um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A palavra-passe é obrigatória.' })
  @MinLength(6, { message: 'A palavra-passe deve ter pelo menos 6 caracteres.' })
  password: string;
}