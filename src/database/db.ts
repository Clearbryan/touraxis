import mongoose from "mongoose"

export async function connect(user: string, pass: string, db: string) {
    try {
        await mongoose.connect(`mongodb+srv://${user}:${pass}@touraxis.p4pjv.mongodb.net/${db}?retryWrites=true&w=majority&appName=TourAxis`)
        console.log(`Connected to database`);
    } catch (error) {
        console.log(`Error connecting to database... `, error);
        process.exit(1)
    }
}