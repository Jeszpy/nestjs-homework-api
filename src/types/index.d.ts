import {UserAccountType} from "../repositories/mongo-db/users-repository";


declare global{
    declare namespace Express {
        export interface Request {
            user: UserType | null
        }
    }
}