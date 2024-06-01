import mongoose from "mongoose";

//create the model for the database
const userModel = mongoose.Schema(
    {
        firstName:
        {
            type: String,
            required: true
        },
        lastName:
        {
            type: String,
            required: true
        },
        userName:
        {
            type: String,
            required: true
        },
        password:
        {
            type: String,
            required: true,
            minlength: 8
        },
        gender:
        {
            type: String,
            required: true,
            enum: ["male", "female", "other", "choose not to identify"]
        },
        profilePicture:
        {
            type: String,
            default: ""
        }
    });

    const User = mongoose.model("User", userModel);

    export default User;