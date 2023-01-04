import {usersCollection} from "./db"

const getOutputUser = (user: any) => {
    return {
        id: user._id,
        login: user.login,
        email: user.email,
        hash: user.hash,
        createdAt: user.createdAt,
        emailConfirmation: {
            confirmationCode: user.emailConfirmation.confirmationCode,
            expirationDate: user.emailConfirmation.expirationDate,
            isConfirmed: user.emailConfirmation.isConfirmed
        }
    }
}

export const authRepository = {
    async findByLoginOrEmail(loginOrEmail: string) {
        const res =  await usersCollection.findOne(
            {$or: [{email: loginOrEmail}, {login: loginOrEmail}]}
        )
        return getOutputUser(res)
    },
    async findByCode(code: string) {
        const res = await usersCollection.findOne({'emailConfirmation.confirmationCode': code})
        return getOutputUser(res)
    },
    async updateConfirmation(code: string) {
        const res = await usersCollection
            .updateOne({'emailConfirmation.confirmationCode': code}, {$set: {'emailConfirmation.isConfirmed': true}})
        return res.modifiedCount === 1
    }
}