import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    private generateSalt() {
        return randomBytes(8).toString('hex');
    }

    private async hashPassword(
        password: string, 
        salt: string
    ): Promise<Buffer> {
        return (await scrypt(password, salt, 32)) as Buffer;
    }

    async signup(email: string, password: string) {
        const users = await this.usersService.find(email);
        console.log(users);
        if (users.length) {
            throw new BadRequestException('Email in use!');
        }

        const salt = this.generateSalt();
        const hash = await this.hashPassword(password, salt);
        const result = salt + '.' + hash.toString('hex');

        const user = this.usersService.create(email, result);

        return user;
    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Bad password');
        }

        return user;

    }
}