import {usersCollection} from "./db"

export const authRepository = {
    async findByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne(
            {$or: [{email: loginOrEmail}, {login: loginOrEmail}]}
        )
    },
    async findByCode(code: string) {
        return await usersCollection.findOne({'emailConfirmation.confirmationCode': code})
    },
    async updateConfirmation(code: string) {
        const res = await usersCollection
            .updateOne({'emailConfirmation.confirmationCode': code}, {$set: {'emailConfirmation.isConfirmed': true}})
        return res.modifiedCount === 1
    }
}