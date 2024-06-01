import express from "express"
import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import generateTokenAndStoreInCookie, { deleteToken } from "../utils/jwtTokenGenerator.js";

//create a router
const router = express.Router();

router.post("/signup", async(req, res) =>
{
    try
    {
        //extract the fields
        const {firstName, lastName, userName, password, confirmPassword, gender} = req.body;

        //check if the passwords are the same
        if(password !== confirmPassword)
        {
            res.status(400).send({error: "Passwords did not match, try again"});
        }    
        //if succesfull, then we attempt to find the user in the mongoDB
        else if(await User.findOne({userName}))
        {
            //if the user is found in the database, then return an error
            res.status(400).send({error: "User already exists"}).send()
        }
        else
        {
            //we passed all the required tests and now we can hash the password and store the new user in the system

            //to encrypt your password, we must first create a salt
            const salt = await bcrypt.genSalt(10);

            //using this alt we then generate a hash
            const hashPassword = await bcrypt.hash(password, salt);

            //get a placeholder image from an API
            const profilePic = `https://ui-avatars.com/api/?name=${firstName}+${lastName}`

            //create the new user
            const newUser = new User(
                {
                    firstName,
                    lastName,
                    userName,
                    password: hashPassword,
                    gender,
                    profilePicture: profilePic
                }
            );
            
            if(newUser)
            {
                //save the new user in the database
                await newUser.save();

                //generate the json web token
                generateTokenAndStoreInCookie(newUser._id, res);

                //send back a success response code
                //send back the saved details to the user
                res.status(201).send(
                {
                    _id: newUser._id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    profilePic: newUser.profilePicture
                });
            }
            else
            {
                res.status(400).send({error: "Error when creating the new user"});
            }
        }
    }
    catch(error)
    {
        console.log("Error in trying to sign up the user: " + error);
        res.status(500).send({error: "Internal server error"});
    }
})

router.post("/login", async(req, res) =>
{
    try
    {
        //get the username and password from the request
        const {userName, password} = req.body;

        //try to get the user from the database based on the username
        const user = await User.findOne({userName});

        if(user)
        {
            //try to see if the passwords match
            const isPasswordCorrect = bcrypt.compare(password, user.password)

            if(isPasswordCorrect)
            {
                //if the passoword is correct, generate a cookie and send a 200 status code
                generateTokenAndStoreInCookie(user._id, res);

                res.status(200).send(
                {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profilePic: user.profilePicture
                });
            }
            else
            {
                res.status(400).send({error: "Invalid password please try again"});
            }
        }
        else
        {
            res.status(400).send({error: "Invalid user name please try again"});
        }
    }
    catch(error)
    {
        console.log("Error in trying to log in the user: " + error);
        res.status(500).send({error: "Internal server error"});
    }
})

router.post("/logout", async(req, res) =>
{
    try
    {
        //delete the json web token
        deleteToken(res);

        //send a success code
        res.status(200).send({message: "Logout Successful"});
    }
    catch(error)
    {
        console.log("Error in trying to logout the user: " + error);
        res.status(500).send({error: "Internal server error"});
    }
})
//export the router
export default router;