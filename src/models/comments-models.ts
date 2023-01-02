export type CommentsTypeOutput = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}

export type CommentsTypeInput = {
    content: string
}

export type CommentsTypeInputInPost = {
    content: string
}

export type CommentsIdParams = {
    id: string
}