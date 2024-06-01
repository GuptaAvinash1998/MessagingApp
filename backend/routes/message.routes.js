import express from "express";
import MessageModel from "../models/messages.model.js";
import ConversationModel from "../models/conversations.model.js"
import validateUserLoggedIn from "../utils/validateUserIsLoggedIn.js";

const messagesRouter = express.Router();

messagesRouter.post("/send/:id", validateUserLoggedIn, async (req, res) =>
{
    try
    {
        //get the message
        const {message} = req.body;

        //get the receiver id
        const {id: receiverId} = req.params

        //get the sender id
        const senderId = req.user._id;

        //try to find the conversation between the sender and the reciever
        let conversation = await ConversationModel.findOne(
            {
                participants: {$all: [senderId, receiverId]}
            }
        );

        //if we cannot find a conversation between these 2, then create a new conversation
        if(!conversation)
        {
            conversation = await ConversationModel.create({participants: [senderId, receiverId]});
        }

        //create a new message object
        MessageModel.create({
            senderId: senderId,
            recieverId: receiverId,
            message: message}).then(newMessage => {
                conversation.messages.push(newMessage._id);
                conversation.save()
                res.status(200).send(newMessage);
            })
            .catch(error => {
                console.log("Error creating message:", error);
                res.status(400).send({error: "Error creating message"});
            });
    }
    catch(error)
    {
        console.log("Error when trying to send a message: " + error);
        res.status(500).send({message: "Internal server error"});
    }
});

//an endpoint for getting all the messages between two people. The uri for this
//request contains the ID of the user you want get the conversation history with
messagesRouter.get("/get/:id", validateUserLoggedIn, async (req, res) =>
{
    try
    {
        //get the id of the user you want to chat with
        const {id: userToChatWith} = req.params;

        //get the sender ID
        const senderId = req.user._id;

        //get the conversation between the sender and the receiever
        //the conversation document has a list of object IDs for the messages
        //to replace these with the content of the messages itself, the populate function
        //does exactly that
        const conversation = await ConversationModel.findOne({participants: {$all: [senderId, userToChatWith]},}).populate("messages");

        if(!conversation)
        {
            return res.status(200).json([]);
        }

        res.status(200).send(conversation);
    }
    catch(error)
    {
        console.log("Error when getting the messages: " + error);
        res.status(500).send({error: "Internal Server Error"});
    }
})

export default messagesRouter;