import request from "supertest";
import app from "../../app";
import UserModel from "../../models/user.model";

describe(
    "Integration Test: Auth Routes",
    () => {
        beforeAll(
            async () => {
                // Clear the test database before running tests
                await UserModel.deleteMany({});
            }
        );

        afterAll(
            async () => {
                // Clear the test database after running tests
                await UserModel.deleteMany({});
            }
        );

        describe(
            'POST /api/v1/auth/register', // namm 
            () => { // function
                test(
                    "should validate user", // actual test name
                    async () => {
                        const res = await request(app)
                            .post("/api/v1/auth/register")
                            .send(
                                {
                                    "firstName": "Mero",
                                    "lastName": "Naam"
                                }
                            );
                        // what we expect to happen
                        expect(res.statusCode).toBe(400);
                        // multiple expectations
                        expect(res.body.success).toBe(false);
                    }
                )
            }
        );

    }
)