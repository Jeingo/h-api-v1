import {CommentsTypeOutput} from "../models/comments-models";
import {postsRepository} from "../repositories/posts-repository";
import {LoginTypeForAuth} from "../models/auth-models";
import {commentsRepository} from "../repositories/comments-repository";

export const commentsService = {
    async createComment(content: string, postId: string, user: LoginTypeForAuth): Promise<CommentsTypeOutput | null> {
        const foundPost = await postsRepository.getPostById(postId)
        if(!foundPost) {
            return null
        }
        const createdComment = {
            content: content,
            userId: user.userId,
            userLogin: user.login,
            createdAt: new Date().toISOString(),
            postId: postId
        }
        return await commentsRepository.createComment(createdComment)
    }
}