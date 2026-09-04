import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Comprar café', description: 'Título da tarefa' })
  @IsString({ message: 'O título precisa ser um texto' })
  @IsNotEmpty({ message: 'O título não pode estar vazio' })
  title: string;

  @ApiPropertyOptional({ example: 'Grão 100% arábica', description: 'Descrição detalhada' })
  @IsString({ message: 'A descrição precisa ser um texto' })
  @IsOptional()
  description?: string;
}