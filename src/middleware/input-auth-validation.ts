import {body} from "express-validator"
import {usersCollection} from "../repositories/db";

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

export const loginRegistrationValidation = body('login').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')
    .isLength({max: 10, min: 3}).withMessage('Should be less than 10 and more than 3 symbols')
    .matches(patternLogin).withMessage('Should be correct login with a-z/A-Z/0-9')

export const passwordRegistrationValidation = body('password').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')
    .isLength({max: 20, min: 6}).withMessage('Should be less than 20 and more than 6 symbols')

export const emailRegistrationValidation = body('email').trim()
    .notEmpty().withMessage(`Shouldn't be empty`)
    .isString().withMessage('Should be string type')
    .matches(patternEmail).withMessage('Should be correct email')
    .custom(checkEmail).withMessage('The user with this email is already exist')
