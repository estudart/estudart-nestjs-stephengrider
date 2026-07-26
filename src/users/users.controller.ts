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
    UseGuards,
    NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';


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

    @UseGuards(AuthGuard)
    @Get('/whoami')
    async whoAmI(
        @CurrentUser() user: User
    ) {
        return user;
    }

    @Post('/signout')
    async signOut(
        @Session() session: any,
    ) {
        session.userId = null;
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
    async findUser(@Param('id') id: string) {
        const user = await this.userService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        const users = this.userService.find(email);
        if (!users) {
            throw new NotFoundException('User not found');
        }
        return users;
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
