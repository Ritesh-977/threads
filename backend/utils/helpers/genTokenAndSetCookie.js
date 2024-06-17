import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const genTokenAndSetCookie = (userId, res)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: '30d',
    })
    res.cookie("jwt", token,{
        httpOnly: true, // more secure
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milisecond
        sameSite: "strict", // CSRF

    })
    return token;

}

export default genTokenAndSetCookie;