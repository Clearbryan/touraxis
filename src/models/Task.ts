import mongoose, { Schema, Document } from 'mongoose';
import { ITask } from '../types/types';

const taskSchema: Schema = new Schema({
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    date_time: { type: Date, default: () => new Date(), index: true },
    next_execute_date_time: { type: Date, index: true, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
    user_id: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', index: true },
    status: { type: String, default: 'To Do', index: true }
});

export default mongoose.model<ITask & Document>('Task', taskSchema);