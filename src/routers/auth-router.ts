import {Router, Response} from "express";
import {
    loginOrEmailValidation,
    passwordFromAuthValidation
} from "../middleware/input-auth-validation";
import {inputValidation} from "../middleware/input-validation";
import {RequestWithBody} from "../models/types";
import {LoginTypeInput} from "../models/auth-models";
import {HTTP_STATUSES} from "../constats/status";
import {authService} from "../domain/auth-service";
import {jwtService} from "../application/jwt-service";

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
