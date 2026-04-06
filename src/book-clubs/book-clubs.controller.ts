import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { BookClubsService } from './book-clubs.service';
import { BookClubDto } from './dto/create-book-club.dto';

@Controller('book-clubs')
export class BookClubsController {
    constructor(private bookClubsService: BookClubsService) {};

    @Get()
    getBookClubs() {
        return this.bookClubsService.getBookClubs();
    }

    @Post()
    postBookClub(@Body() bookClub: BookClubDto, @Request() req) {
    return this.bookClubsService.postBookClub(bookClub, req.user.userId);
    }

    @Get(":id")
    getBookClubsOfUser(@Param('id') id: string) {
        return this.bookClubsService.getBookClubsOfUser(Number(id));
    }

    @Get(":id")
    getBookClubById(@Param('id') id: string) {
        return this.bookClubsService.getBookClubById(Number(id));
    }
}
