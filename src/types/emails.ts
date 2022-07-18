import {WithId} from "mongodb";

export type EmailType = {
    id: string,
    email: string,
    subject: string,
    userLogin: string,
    confirmationCode: string,
    status: string,
    createdAt: Date
}