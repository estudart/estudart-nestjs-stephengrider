import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";

let service: typeof AuthService;

beforeEach(async () => {
    // Create a fake copy of the UsersService
    const fakeUsersService: Partial<UsersService> = {
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