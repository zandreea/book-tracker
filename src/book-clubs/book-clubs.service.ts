import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookClubDto } from './dto/create-book-club.dto';

@Injectable()
export class BookClubsService {
    constructor(private prisma: PrismaService) {}
    
    async getBookClubs() {
        return await this.prisma.bookClub.findMany();
    }

    async postBookClub(bookClub: BookClubDto, userId: number) {
        return await this.prisma.bookClub.create({data: { ...bookClub, userId }});
    }

    async getBookClubsOfUser(id: number) {
        return await this.prisma.bookClub.findMany({where: {userId: id}})
    }

    async getBookClubById(id: number) {
        return await this.prisma.bookClub.findMany({where: {id: id}})
    }
}
