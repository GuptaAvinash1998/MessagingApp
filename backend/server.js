import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/users.routes.js"
import connectDb from "./db/connectDb.js"

const app = express()
const PORT = process.env.PORT || 8000

//setup the dotenv object to get the variables stored in the dotenv file
dotenv.config();

app.use(cors());
app.use(cookieParser());

//this would be used to parse incoming requests as JSON objects
app.use(express.json());

app.get("/", (req, res) =>
{
    res.send("Hello Landing page");
})

//for all actions related to authentication, the url will be server:port/auth/...
//set the express server to use the auth router defined in the routes folder of the backend
app.use("/auth", authRoutes);

//for all actions relation to messages, the url will be server:port/messages/...
//set the express server to use the messages router defined in the routes folder
app.use("/messages", messageRoutes);

//for all actions relation to users, the url will be server:port/users/...
//set the express server to use the users router defined in the routes folder
app.use("/users", userRoutes);

app.listen(PORT, () => 
{
    //attempt to connect to the database
    connectDb();
    console.log(`Express server listening on port ${PORT}`)
});