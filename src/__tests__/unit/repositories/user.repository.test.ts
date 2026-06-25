import { UserMongoRepository } from "../../../repositories/user.repository";

describe(
    "Unit Test: UserMongoRepository",
    () => {
        let userRepository = new UserMongoRepository();
        const userData: any = {
            username: "testuser",
            email: "mero@email.com",
            firstName: "Mero",
            lastName: "Naam",
            password: "password123",
            role: "user"
        }
        test(
            'should create a new user',
            async () => {
                const createdUser = await userRepository.create(userData);
                expect(createdUser).toBeDefined();
                expect(createdUser).toHaveProperty('_id');
                expect(createdUser.username).toBe(userData.username); // check if the username matches
                expect(createdUser.email).toBe(userData.email); // check if the email matches
            }
        )
    }
)