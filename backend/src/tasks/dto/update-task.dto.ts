import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ example: true, description: 'Status de conclusão' })
  @IsBoolean({ message: 'isCompleted precisa ser um booleano (true ou false)' })
  @IsOptional()
  isCompleted?: boolean;
}