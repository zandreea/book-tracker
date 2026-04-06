import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {};

    @UseGuards(JwtAuthGuard)
    @Get()
    getUsers() {
        return this.usersService.getUsers();
    }

    @Get(':id')
    getUserById(@Param('id') id: string) {
        return this.usersService.getUserById(Number(id));
    }

    @Get(':email')
    getUserByEmail(@Param('email') email: string) {
        return this.usersService.getUserByEmail(email);
    }

    @Post()
    postUser(@Body() user: UserDto) {
        return this.usersService.postUser(user);
    }

    @Delete(':id')
    deleteUserById(@Param('id') id: string) {
        return this.usersService.deleteUserById(Number(id));
    }
}
