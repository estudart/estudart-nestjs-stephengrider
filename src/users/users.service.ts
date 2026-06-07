import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>
    ) {}

    create(email: string, password: string) {
        const newUser = this.repo.create({ email, password });
        return this.repo.save(newUser);
    }

    findOne(id: number) {
        return this.repo.findOneBy({id});
    };

    find(email: string) {
        return this.repo.find( { where: { email } });
    };

    async update(id: number, updateParams: Partial<User>) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('User not found');
        };
        Object.assign(user, updateParams);
        return this.repo.save(user);
    };

    async remove(id: number): Promise<User> {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('User not found!');
        }
        return this.repo.remove(user);
    };
}
