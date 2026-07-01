import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // Create a fake copy of the UsersService
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => 
                Promise.resolve({ id: 1, email, password } as User)
        };
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                }
            ],
        }).compile();

        service = module.get(AuthService);
    })

    it('can create an instance of AuthService', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with salted and hashed password', async () => {
        const user = await service.signup('some@email.com', 'some_password');
        expect(user.email).toEqual('some@email.com');
        expect(user.password).not.toEqual('some_password');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if try to signup with already in use email', async () => {
        fakeUsersService.find = () => Promise.resolve(
            [{ id: 1, email: 'a', password: '1'} as User]
        );
        await expect(service.signup('asdas@asdas.com', 'asdas')).rejects.toThrow(
            BadRequestException,
        );
    });

    it('throws an error if try to signin with no matching user', async () => {
        fakeUsersService.find = (email: string) => {
            if (email == 'test@email.com') {
                return Promise.resolve(
                    [{ id: 1, email: 'test@email.com', password: 'pass'} as User]
                );
            }
            return Promise.resolve([]);
        };
        await expect(service.signin('wrong@email.com', '1')).rejects.toThrow(
            NotFoundException,
        );
    });
});

