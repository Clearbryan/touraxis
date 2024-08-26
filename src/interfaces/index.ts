export type IUser = {
    _id?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
}

export interface MongoDBError extends Error {
    code: number;
    keyValue: { [key: string]: string };
}
