import {
    Body,
    Controller,
    Get,
    Post,
    Delete,
    Patch,
    Param,
    Query,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@Controller('auth')
export class UsersController {
    constructor(
        private userService: UsersService,
    ) {}

    @Post('/signup')
    creatUser(@Body() body: CreateUserDto) {
        this.userService.create(
            body.email, 
            body.password
        );
    }

    @UseInterceptors(SerializeInterceptor)
    @Get('/:id')
    findUser(@Param('id') id: string) {
        return this.userService.findOne(parseInt(id));
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.userService.find(email);
    }

    @Delete('/:id')
    deleteUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    async updateUser(
        @Param('id') id: string, 
        @Body() body: UpdateUserDto
    ): Promise<User> {
        return await this.userService.update(parseInt(id), body);
    }
}
