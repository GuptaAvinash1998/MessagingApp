import mongoose from "mongoose";
import User from "./user.model.js";

//The schema of a message is going to have a senderId, receiverId, and the message itself
//it will also have a timestamp object set to true so that we know when a message instance has been created
const messageSchema = mongoose.Schema(
    {
       senderId:
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: User,
           required: true
       },

       recieverId:
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User",
           required: true
       },

       message:
       {
           type: String,
           required: true
       }
    },
    {
        timestamps: true
    }
)

const MessageModel = mongoose.model("Messages", messageSchema);

export default MessageModel;