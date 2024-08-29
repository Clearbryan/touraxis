import mongoose from "mongoose"

const DB_USER = process.env.DB_USER as string
const DB_PASS = process.env.DB_PASS as string
const DB_NAME = process.env.DB_NAME as string

export async function connect(): Promise<void> {
    try {
        await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@touraxis.p4pjv.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=TourAxis`)
    } catch (error) {
        console.log(`Error connecting to database... `, error);
        process.exit(1)
    }
}

export const projections: Record<string, Record<string, 1 | 0>> = {
    user: {
        _id: 1,
        username: 1,
        first_name: 1,
        last_name: 1
    },
    task: {
        _id: 1,
        name: 1,
        description: 1,
        status: 1,
        user_id: 1,
        next_execute_date_time: 1,
        date_time: 1
    }

}