import jwt from "jsonwebtoken"

//function to generate a JWT token that lasts for 15 days and stores it in the browser's cookie
const generateTokenAndStoreInCookie = (userId, res) =>
{
    //create the token, we create it by using the sign function
    const token = jwt.sign({userId}, process.env.JWT_SECRE_KEY, 
        {
            expiresIn: '15d'
        });

    //store this token in the resposes cookie
    res.cookie("jwtCookieToken", token, 
    {
        maxAge: 15 * 24 * 60 * 60 * 1000, //milliseconds
        httpOnly: true, // this makes sure that the token is accessible only through http
        sameSite: "strict"
    })
}

export const deleteToken = (res) =>
{
    res.cookie("jwtCookieToken", "",
    {
        maxAge: 0
    });
}

export default generateTokenAndStoreInCookie;
