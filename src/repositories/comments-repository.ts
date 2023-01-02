import {CommentsTypeOutput, CommentsTypeToDB} from "../models/comments-models";
import {commentsCollection} from "./db";
import {ObjectId} from "mongodb";

const getOutputComment = (comment: any): CommentsTypeOutput => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userLogin,
        createdAt: comment.createdAt
    }
}

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
    },
    async getCommentById(id: string): Promise<CommentsTypeOutput | null> {
        const res = await commentsCollection.findOne({_id: new ObjectId(id)})

        if(!res) {
            return null
        }

        return getOutputComment(res)
    },
    async deleteComment(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}