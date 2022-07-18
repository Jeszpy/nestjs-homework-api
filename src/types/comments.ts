import {WithId} from "mongodb";

export type CommentsType = WithId<{
    id: string,
    postId: string,
    content: string,
    userId: string,
    userLogin: string,
    addedAt: Date
}>

export type CommentsWithoutPostIdType = {
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    addedAt: Date
}

