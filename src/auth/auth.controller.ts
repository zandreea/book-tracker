import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/users/dto/login.dto';
import { UserDto } from 'src/users/dto/create-user.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {};

    @Public()
    @Post('/login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @Public()
    @Post('/register')
    register(@Body() userDto: UserDto) {
        return this.authService.register(userDto.email, userDto.password, userDto.name);
    }
}
