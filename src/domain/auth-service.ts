import bcrypt from "bcrypt";
import {authRepository} from "../repositories/auth-repository";
import {usersRepository} from "../repositories/users-repository";
import {v4 as v4} from "uuid"
import add from "date-fns/add"
import {emailManager} from "../managers/emails-manager";

export const authService = {
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await authRepository.findByLoginOrEmail(loginOrEmail)
        if(!user) return false
        const res = await bcrypt.compare(password,user.hash)
        if(!res) {
            return false
        }
        return user
    },
    async createUser(login: string , email: string, password: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, passwordSalt)
        const createdUser = {
            login: login,
            email: email,
            hash: passwordHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: v4(),
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmed: false
            }
        }

        const user = await usersRepository.createUserWithRegistration(createdUser)
        await emailManager.sendEmailConfirmation(user)
        return user
    },
    async confirmEmail(code: string) {
        await authRepository.updateConfirmation(code)
    },
    async resendEmail(email: string) {
        const user = await authRepository.findByEmail(email)
        await emailManager.sendEmailConfirmation(user)
}
}