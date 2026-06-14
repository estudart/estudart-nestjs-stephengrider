import {
    Body,
    Controller,
    Get,
    Post,
    Delete,
    Patch,
    Param,
    Query,
    Session,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService,
    ) {}

    @Post('/signin')
    async signin(
        @Body() body: CreateUserDto,
        @Session() session: any,
    ) {
        const user =  await this.authService.signin(
            body.email, 
            body.password
        );
        session.userId = user.id;
        return user;
    }

    @Post('/signup')
    async creatUser(
        @Body() body: CreateUserDto,
        @Session() session: any,
    ) {
        const user =  await this.authService.signup(
            body.email, 
            body.password
        );
        session.userId = user.id;
        return user;
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

    @Patch('/:id')
    async updateUser(
        @Param('id') id: string, 
        @Body() body: UpdateUserDto
    ): Promise<User> {
        return await this.userService.update(parseInt(id), body);
    }
}
