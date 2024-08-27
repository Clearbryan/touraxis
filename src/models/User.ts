import mongoose, { Schema } from 'mongoose'
import { IUser } from '../types/types';

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, index: true },
    first_name: { type: String, required: true, index: true },
    last_name: { type: String, required: true, index: true },
    password: { type: String, required: true }
});

export = mongoose.model('User', userSchema)