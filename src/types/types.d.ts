import { Request } from "express";
import { ObjectId } from "mongoose";
export type IUser = {
    _id?: ObjectId;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
}

export type ITask = {
    _id?: ObjectId;
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

export interface IProjection {
    user: {
        _id: ObjectId
        username: string
        first_name: string
        last_name: string
    },
    task: {
        _id: ObjectId
        name: string
        description: sttring
        status: string
        user_id: string
        next_execute_date_time: Date
        date_time: Date
    }
}