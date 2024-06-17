import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import genTokenAndSetCookie from '../utils/helpers/genTokenAndSetCookie.js';

// Signup
const signupUser = async (req, res)=>{

   try {
    const {name, email, username, password} = req.body; // We are able to parse these data from req.body due to app.use(express.json()); from server.js
     
     // Check if user already exits
    const user = await User.findOne({$or:[{email},{username}]});

    if(user){
        return res.status(400).json({message: "User already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
        name,
        email,
        username,
        password: hashedPassword
    })
    await newUser.save();
    if(newUser){
        genTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username
    })
    }
    else{
        res.status(400).json({message: "Invalid user data"});
    }

   } catch (err) {
     res.status(500).json({message: err.message})
     console.log("Error in signupUser: ", err.message)
   }
};

// Login
const loginUser = async (req,res)=>{
    try {
        const {username, password} = req.body
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect) {
           return res.status(400).json({message:"Invalid Credentials"})
        }

        genTokenAndSetCookie(user._id, res);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username
        });

        
    } catch (err) {
        res.status(500).json({message: err.message})
        console.log("Error in loginUser: ", err.message)
    }
}

// Logout
const logoutUser =  (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:1});
        res.json({message:"User logged out successfully"});
        
    } catch (err) {
        res.status(500).json({message: err.message})
        console.log("Error in loginUser: ", err.message)
    }
}

// Follow and Unfollow
const followUnfollowUser = async(req, res)=>{};
export { signupUser, loginUser , logoutUser, followUnfollowUser};