import {Router, Request, Response} from "express";
import {bearerAuth} from "../authorization/bearer-auth";
import {idValidation, inputValidation} from "../middleware/input-validation";
import {contentValidation} from "../middleware/input-posts-validation";
import {RequestWithParams, RequestWithParamsAndBody} from "../models/types";
import {CommentsIdParams, CommentsTypeInput, CommentsTypeOutput} from "../models/comments-models";
import {commentsService} from "../domain/comments-service";
import {HTTP_STATUSES} from "../constats/status";
import {commentsCollection} from "../repositories/db";

export const commentsRouter = Router({})

commentsRouter.get('/:id',
    idValidation,
    async (req: RequestWithParams<CommentsIdParams>,
           res: Response<CommentsTypeOutput>) => {
    const foundComment = await commentsService.getCommentById((req.params.id))

        if (!foundComment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(foundComment)
    })

commentsRouter.put('/:id',
    bearerAuth,
    idValidation,
    contentValidation,
    inputValidation,
    async (req: RequestWithParamsAndBody<CommentsIdParams, CommentsTypeInput>,
           res: Response) => {
    })

commentsRouter.delete('/:id',
    bearerAuth,
    idValidation,
    async (req: RequestWithParams<CommentsIdParams>,
           res: Response) => {
    const deletedComment = await commentsService.deleteComment(req.params.id, req.user!)

        if (deletedComment === HTTP_STATUSES.NOT_FOUND_404) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        if (deletedComment === HTTP_STATUSES.FORBIDDEN_403) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })