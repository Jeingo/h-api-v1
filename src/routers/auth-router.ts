import {Router, Response, Request} from "express";
import {
    emailRegistrationValidation,
    loginOrEmailValidation, loginRegistrationValidation,
    passwordFromAuthValidation, passwordRegistrationValidation
} from "../middleware/input-auth-validation";
import {inputValidation} from "../middleware/input-validation";
import {RequestWithBody} from "../models/types";
import {LoginTypeInput} from "../models/auth-models";
import {HTTP_STATUSES} from "../constats/status";
import {authService} from "../domain/auth-service";
import {jwtService} from "../application/jwt-service";
import {bearerAuth} from "../authorization/bearer-auth";
import {UsersTypeInput} from "../models/users-models";

export const authRouter = Router({})

authRouter.post('/login',
    loginOrEmailValidation,
    passwordFromAuthValidation,
    inputValidation,
    async(req: RequestWithBody<LoginTypeInput>,
          res: Response) => {
    const user = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if(user) {
        const token = await jwtService.createJWT(user)
        res.status(HTTP_STATUSES.OK_200).json(token)
        return
    }
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
})

authRouter.get('/me',
    bearerAuth,
    async (req: Request, res: Response) => {
    res.status(HTTP_STATUSES.OK_200).json(req.user)
})

authRouter.post('/registration',
    loginRegistrationValidation,
    passwordRegistrationValidation,
    emailRegistrationValidation,
    inputValidation,
    async (req: RequestWithBody<UsersTypeInput>, res: Response) => {

    })
