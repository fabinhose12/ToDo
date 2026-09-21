import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await (this.prisma as any).user.findUnique({
      where: { email: createUserDto.email },
    });

    if (userExists) {
      throw new ConflictException('E-mail já registado.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await (this.prisma as any).user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    // Remove a senhae do retorno por segurança
    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    return (this.prisma as any).user.findUnique({
      where: { email },
    });
  }

  async findOne(id: string) {
    return (this.prisma as any).user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }
}