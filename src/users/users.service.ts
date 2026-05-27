import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

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
            throw new Error('User not found');
        };
        Object.assign(user, updateParams);
        return this.repo.save(user);
    };

    remove() {};
}
