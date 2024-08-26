import mongoose from "mongoose"

export async function connect() {
    try {
        await mongoose.connect(`mongodb+srv://chetekwebrian:riYsahtAbMY0b51V@touraxis.p4pjv.mongodb.net/touraxis?retryWrites=true&w=majority&appName=TourAxis`)
        console.log(`Connected to database`);
    } catch (error) {
        console.log(`Error connecting to database... `, error);
        process.exit(1)
    }
}