import {usersRepository} from "../repositories/users-repository";
import {UsersTypeOutput} from "../models/users-models";
import bcrypt from "bcrypt"
import {usersCollection} from "../repositories/db";
import {ObjectId} from "mongodb";
import {LoginTypeForAuth} from "../models/auth-models";

const getOutputBlog = (user: any): LoginTypeForAuth => {
    return {
        email: user.email,
        login: user.login,
        userId: user._id
    }
}

export const usersService = {
    async getUserById(_id: ObjectId): Promise<LoginTypeForAuth | null> {
        const res = await usersCollection.findOne({_id})

        if(res) {
            return getOutputBlog(res)
        }
        return null
    },
    async createUser(login: string, password: string, email: string): Promise<UsersTypeOutput> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, passwordSalt)
        const createdUser = {
            login: login,
            hash: passwordHash,
            email: email,
            createdAt: new Date().toISOString()
        }
        return await usersRepository.createUser(createdUser)
    },
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    }
}