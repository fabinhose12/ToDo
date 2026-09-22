import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Comprar café', description: 'Título da tarefa' })
  @IsString({ message: 'O título precisa ser um texto' })
  @IsNotEmpty({ message: 'O título não pode estar vazio' })
  title: string;

  @ApiPropertyOptional({ example: 'Grão 100% arábica', description: 'Descrição detalhada' })
  @IsString({ message: 'A descrição precisa ser um texto' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'ALTA', description: 'Prioridade da tarefa (BAIXA, MEDIA, ALTA)' })
  @IsString({ message: 'A prioridade precisa ser um texto' })
  @IsOptional()
  priority?: string;

  @ApiProperty({ description: 'ID do utilizador que criou a tarefa' })
  @IsUUID('4', { message: 'authorId precisa ser um UUID válido' })
  authorId: string;

  @ApiProperty({ description: 'ID do utilizador ao qual a tarefa foi atribuída' })
  @IsUUID('4', { message: 'assignedToId precisa ser um UUID válido' })
  assignedToId: string;

}
