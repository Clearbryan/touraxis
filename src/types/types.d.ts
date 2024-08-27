import { Request } from "express";
export type IUser = {
    username: string;
    first_name: string;
    last_name: string;
    password: string;
}

export type ITask = {
    name: string;
    description: string;
    status: string;
    next_execute_date_time: Date;
    user_id: ObjectId;
    date_time: Date

}

export interface MongoDBError extends Error {
    code: number;
    keyValue: { [key: string]: string };
}

export interface AuthenticatedRequest extends Request {
    user?: {
        _id?: Types.ObjectId;
    };
}