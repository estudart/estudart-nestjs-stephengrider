import { Body, Controller, Get, Post, Delete, Patch, Param, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

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
}
