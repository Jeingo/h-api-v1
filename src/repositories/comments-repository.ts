import {CommentsTypeOutput, CommentsTypeToDB} from "../models/comments-models";
import {commentsCollection} from "./db";

export const commentsRepository = {
    async createComment(createdComment: CommentsTypeToDB): Promise<CommentsTypeOutput> {
        const res = await commentsCollection.insertOne(createdComment)
        return {
            id: res.insertedId.toString(),
            content: createdComment.content,
            userId: createdComment.userId,
            userLogin: createdComment.userLogin,
            createdAt: createdComment.createdAt
        }
    }
}