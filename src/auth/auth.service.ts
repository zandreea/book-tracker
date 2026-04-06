import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersService : UsersService, private jwtService: JwtService) {}

    async register(email: string, password: string, name: string): Promise<Omit<User, 'password'>> {
        return await this.usersService.postUser({ email, name, password });
    }

    async login(email: string, pwd: string): Promise<{access_token}> {
        const user = await this.usersService.getUserByEmail(email);
        if(user == null || !await bcrypt.compare(pwd, user.password)) {
            throw new UnauthorizedException('Username or password invalid');
        }
        return { access_token: this.jwtService.sign({userId: user.id, email: user.email})};
    }
}
