import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  // Definição dos campos do utilizador que queremos expor (ocultando a password)
  private readonly userSelect = {
    select: {
      id: true,
      name: true,
      email: true,
    },
  };

  async findAll() {
    return this.prisma.task.findMany({
      include: {
        author: this.userSelect,
        assignedTo: this.userSelect,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        author: this.userSelect,
        assignedTo: this.userSelect,
      },
    });

    if (!task) {
      throw new NotFoundException(`Tarefa com o ID "${id}" não foi encontrada.`);
    }

    return task;
  }
}