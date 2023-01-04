import {body} from "express-validator"
import {usersCollection} from "../repositories/db";
import {authRepository} from "../repositories/auth-repository";

export const loginOrEmailValidation = body('loginOrEmail').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')

export const passwordFromAuthValidation = body('password').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')

const patternLogin = /^[a-zA-Z0-9_-]*$/
const patternEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/

const checkEmail = async (email: string ) => {
    const foundEmail = await usersCollection.findOne({email: email})
    if(foundEmail) {
        throw new Error('Email is already exist')
    }
    return true
}

const checkLogin = async (login: string ) => {
    const foundLogin = await usersCollection.findOne({login: login})
    if(foundLogin) {
        throw new Error('Email is already exist')
    }
    return true
}

const checkCode = async (code: string) => {
    const foundUser = await authRepository.findByCode(code)
    if(!foundUser) {
        throw new Error('This code is wrong')
    }
    if(foundUser.emailConfirmation.confirmationCode !== code) {
        throw new Error('This code is wrong')
    }
    if(foundUser.emailConfirmation.expirationDate < new Date()) {
        throw new Error('This code is expired')
    }
    return true
}

const checkEmailResending = async (email: string) => {
    const foundUser = await authRepository.findByLoginOrEmail(email)
    if(!foundUser) {
        throw new Error('This email is wrong')
    }
    if(foundUser.emailConfirmation.isConfirmed === true) {
        throw new Error('Account is already confirmed')
    }
    return true
}

export const loginRegistrationValidation = body('login').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')
    .isLength({max: 10, min: 3}).withMessage('Should be less than 10 and more than 3 symbols')
    .matches(patternLogin).withMessage('Should be correct login with a-z/A-Z/0-9')
    .custom(checkLogin).withMessage('The user with this login is already exist')

export const passwordRegistrationValidation = body('password').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')
    .isLength({max: 20, min: 6}).withMessage('Should be less than 20 and more than 6 symbols')

export const emailRegistrationValidation = body('email').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')
    .matches(patternEmail).withMessage('Should be correct email')
    .custom(checkEmail).withMessage('The user with this email is already exist')

export const codeValidation = body('code').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')
    .custom(checkCode)

export const emailResendValidation = body('email').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')
    .matches(patternEmail).withMessage('Should be correct email')
    .custom(checkEmailResending).withMessage('The user with this email is already confirmed')
