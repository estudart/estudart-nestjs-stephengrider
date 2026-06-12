import { BadRequestException, Injectable } from "@nestjs/common";
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
        if (users.length) {
            throw new BadRequestException('Email in use!');
        }

        const salt = this.generateSalt();
        const hash = await this.hashPassword(password, salt);
        const result = salt + '.' + hash.toString('hex');

        const user = this.usersService.create(email, result);
    }

    signin() {
        
    }
}