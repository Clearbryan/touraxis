import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, index: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
});

export = mongoose.model('User', userSchema)