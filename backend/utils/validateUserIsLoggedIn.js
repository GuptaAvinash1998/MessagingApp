import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

//this function will check if the user is logged in before sending a message
//or before doing anything in the app
//to check if the user is logged in, we get the json web token that was generated when
//the user logged in. If we can find that token, we know that the user is logged in

const validateUserLoggedIn = async(req, res, next) =>
{
    try
    {
        //get the token from the request
        const token = req.cookies.jwtCookieToken;

        //if we cannot find the token
        if(!token)
        {
            return res.status(400).send({message: "Unauthroized: No token provided"});
        }

        //if we have found the token, then try and decode it
        const decodedToken = jwt.decode(token, process.env.JWT_SECRE_KEY);

        //if there was an error decoding the token
        if(!decodedToken)
        {
            return res.status(400).send({message: "Unauthorized: Invalid Token"});
        }

        //once we have the token, get the user
        //we do not want the password when we find the user, we can exclude that
        const user = await User.findById(decodedToken.userId).select("-password");

        //if we cannot find the user
        if(!user)
        {
            return res.status(404).send({message: "User is not found"});
        }

        //set the user into the request
        req.user = user;

        //the next function is a function that allows another function to execute when this is done
        //notice how this function is used in the message router's send message post end point
        //this function will be called before the user can send a message. If everything in this message
        //passes, then we can send the message
        next();
    }
    catch(error)
    {
        console.log("Error when trying to determine if user is logged in: " + error);
        res.status(500).send({message: "Internal server error"});
    }
}

export default validateUserLoggedIn;