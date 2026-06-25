// src/__tests__/setup.ts
import { connectToMongoDBTest } from "../database/mongodb";
import mongoose from "mongoose";

// beforeAll and afterAll are 
// Jest lifecycle methods that run before and after 
// all tests in the test suite, respectively. 
// In this case, we are using them to connect to the MongoDB test database
//  before running any tests and to close the connection
//  after all tests have completed.
beforeAll(async () => {
    await connectToMongoDBTest();
});

afterAll(async () => {
    await mongoose.connection.close();
});