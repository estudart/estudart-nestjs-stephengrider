import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

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
        if (!id) {
            return null;
        }
        const user = this.repo.findOneBy({id});
        if (!user) {
            throw new NotFoundException('User not found');
        };
        return user;
    };

    find(email: string) {
        const user = this.repo.find( { where: { email } });
        if (!user) {
            throw new NotFoundException('User not found');
        };
        return user;
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
