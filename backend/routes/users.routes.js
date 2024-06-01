import express from "express"
import validateUserLoggedIn from "../utils/validateUserIsLoggedIn.js";
import User from "../models/user.model.js";

const userRouter = express.Router();

userRouter.get("/", validateUserLoggedIn, async (req, res) =>
{
    try
    {
        //get the id of the user
        const currentUserId = req.user._id;

        //get a list of all the users in the system except for you
        const allUsers = await User.find({_id: {$ne: currentUserId}}).select("-password");

        if(allUsers)
        {
            res.status(200).json(allUsers);
        }
        else
        {
            res.status(200).send([]);
        }
    }
    catch(error)
    {
        console.log("Error when trying to get all the users: " + error.stack);
        res.status(500).send({error: "Internal Server Error"});
    }
})
export default userRouter;