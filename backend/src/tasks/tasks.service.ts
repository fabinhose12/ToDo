import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private readonly userSelect = {
    select: {
      id: true,
      name: true,
      email: true,
    },
  };

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: createTaskDto,
      include: {
        author: this.userSelect,
        assignedTo: this.userSelect,
      },
    });
  }

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
      throw new NotFoundException(`Tarefa com o ID ${id} não encontrada.`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id); // Garante que a tarefa existe antes de atualizar

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
      include: {
        author: this.userSelect,
        assignedTo: this.userSelect,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); 

    return this.prisma.task.delete({
      where: { id },
    });
  }
}