import mongoose, { Schema, Document } from 'mongoose'
import { ITask, IUser } from '../types/types';

const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true, index: true },
    first_name: { type: String, required: true, index: true },
    last_name: { type: String, required: true, index: true },
    password: { type: String, required: true }
});

export = mongoose.model<ITask & Document>('User', userSchema)