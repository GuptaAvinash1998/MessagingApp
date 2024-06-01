import mongoose from "mongoose";
import User from "./user.model.js";
import MessageModel from "./messages.model.js";

//the conversation schema is going to have the a list of participants involved in the
//conversation and a list of all the messages in the converstaion as well.
//by default the conversation is going to have an empty list of messages
const conversationSchema = mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: User
            }
        ],

        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: MessageModel,
                default: []
            }
        ]
    }
);

//create the model
const ConversationModel = mongoose.model("Conversations", conversationSchema);

export default ConversationModel;