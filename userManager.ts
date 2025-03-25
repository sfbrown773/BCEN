import { User } from "./user";
import { CreateUserForm } from "./userCreationForm";
import { DeleteUserForm } from "./userDeletionForm";
import { test, expect, Page } from "@playwright/test";
import { UserStates } from "./userStates";
import * as fs from "fs";

const USERS_FILE = "./users.json";

export class UserManager {
    private users: { [state: string]: User[] } = {
        'new application': [],
        'retest': [],
        'second attempt': [],
        'no good': []
    };

    private createUserForm: CreateUserForm;

    constructor() {
        this.createUserForm = new CreateUserForm();
        this.loadUsersFromFile(); // Load users when the manager is created
    }

    // Load users from the JSON file
    private loadUsersFromFile() {
        if (fs.existsSync(USERS_FILE)) {
            const data = fs.readFileSync(USERS_FILE, "utf-8");
            this.users = JSON.parse(data);
            //console.log("Users loaded from file:", this.users);
        } else {
            console.log("No saved user file found, starting fresh.");
        }
    }

    // Save users to the JSON file
    async saveUsersToFile() {
        fs.writeFileSync(USERS_FILE, JSON.stringify(this.users, null, 2), "utf-8");
        console.log("Users saved to file.");
    }

    // Ensure a minimum number of users exist in each state
    async initializeUsers(page: Page, targetCounts: { [state: string]: number }) {
        console.log("Initializing users...");
        for (const state of Object.keys(targetCounts)) {
            console.log(state, 'users present: ', this.users[state].length, state, 'users desired: ', targetCounts[state]);
        }
        for (const state of Object.keys(targetCounts)) {
            while (this.users[state].length < targetCounts[state]) {
                const user = await this.createUser(page, state as keyof typeof this.users);
                this.users[state].push(user);
                this.saveUsersToFile(); // Save after modification
            }
        }
    }

    // Creates a user and transitions them into the required state
    async createUser(page: Page, state: keyof typeof this.users): Promise<User> {
        const firstName = `${String(state).replace(/\s/g, '')}First${Date.now()}`;
        const lastName = `${String(state).replace(/\s/g, '')}Last${Date.now()}`;

        const user = await this.createUserForm.createUser(page, firstName, lastName);
        const userStates = new UserStates();

        if (state === "retest") await userStates.changeStateToRetest(user, page);
        if (state === "second attempt") await userStates.changeStateToSecondAttempt(user, page);
        if (state === "no good") userStates.expireUser(user);

        this.saveUsersToFile();
        return user;
    }

    // Retrieve a user from the store, removing it from the pool
    getUser(state: keyof typeof this.users): User {
        if (this.users[state].length === 0) throw new Error(`No available users in state: ${state}`);
        const user = this.users[state][0]; // Access the first user without removing it
        return user;
    }

    // Replenish any depleted states after tests run
    async replenishUsers(page: Page, targetCounts: { [state: string]: number }) {
        console.log("Replenishing users...");
        for (const state of Object.keys(targetCounts)) {
            console.log(state, 'users present: ', this.users[state].length, state, 'users desired: ', targetCounts[state]);
        }
        for (const state of Object.keys(targetCounts)) {
            const needed = targetCounts[state] - this.users[state].length;
            for (let i = 0; i < needed; i++) {
                const user = await this.createUser(page, state as keyof typeof this.users);
                this.users[state].push(user);
                this.saveUsersToFile(); // Save after modification
            }
        }
    }

    // Deletes all test users (optional cleanup)
    async deleteAllUsers(page: Page) {
        console.log("Deleting all users...");
        for (const state in this.users) {
            for (const user of this.users[state]) {
                const deleteUserForm = new DeleteUserForm(user.customerId);
                await deleteUserForm.goto(user.customerId, page);
                await deleteUserForm.deleteUser(page);
            }
            this.users[state] = []; // Clear users from store
        }
        this.saveUsersToFile();
    }
}
