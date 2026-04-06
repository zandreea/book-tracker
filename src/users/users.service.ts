import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getUsers(): Promise<Omit<User, 'password'>[]> {
        const res: User[] = await this.prisma.user.findMany();
        return res.map((user) => {
            const { password, ...userWithoutPassword } = user; 
            return userWithoutPassword;
        });
    }

    async getUserById(id: number): Promise<Omit<User, 'password'> | null> {
        const res: User | null = await this.prisma.user.findUnique({where: {id: id}});
        if (!res) return null;
        const { password, ...userWithoutPassword } = res;
        return userWithoutPassword;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const res: User | null = await this.prisma.user.findUnique({where: {email: email}});
        return res;
    }

    async postUser(user: UserDto): Promise<Omit<User, 'password'>> {
        user.password = await bcrypt.hash(user.password, 10);
        const res = await this.prisma.user.create({data: user});
        const { password, ...userWithoutPassword } = res;
        return userWithoutPassword;
    }

    async deleteUserById(id: number): Promise<void> {
        await this.prisma.user.delete({where: {id: id}})
    }
}
