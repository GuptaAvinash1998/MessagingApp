import mongoose from "mongoose";

const connectDb = async () =>
{
    try
    {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to the mongodb database");
    }
    catch(error)
    {
        console.log("Error when connecting to the mongodb database");
    }
}

export default connectDb;