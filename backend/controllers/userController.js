import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import genTokenAndSetCookie from '../utils/helpers/genTokenAndSetCookie.js';

// Get Users Profile
const getUserProfile = async (req, res)=>{
    const {username} = req.params;
    try {
        const user =  await User.findOne({username}).select("-password").select("-updatedAt");
        if(!user) return res.status(400).json({error: "User not found"});

        res.json(user);
        
    } catch (err) {
        res.status(500).json({error: err.message})
        console.log("Error in getUserProfile: ", err.message)
    }
}


// Signup
const signupUser = async (req, res)=>{

   try {
    const {name, email, username, password} = req.body; // We are able to parse these data from req.body due to app.use(express.json()); from server.js
     
     // Check if user already exits
    const user = await User.findOne({$or:[{email},{username}]});

    if(user){
        return res.status(400).json({error: "User already exists"});
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
        res.status(400).json({error: "Invalid user data"});
    }

   } catch (err) {
     res.status(500).json({error: err.message})
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
           return res.status(400).json({error:"Invalid Credentials"})
        }

        genTokenAndSetCookie(user._id, res);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username
        });

        
    } catch (err) {
        res.status(500).json({error: err.message})
        console.log("Error in loginUser: ", err.message)
    }
}

// Logout
const logoutUser =  (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:1});
        res.json({message:"User logged out successfully"});
        
    } catch (err) {
        res.status(500).json({error: err.message})
        console.log("Error in loginUser: ", err.message)
    }
}

// Follow and Unfollow
const followUnfollowUser = async (req, res)=>{
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id.toString()) return res.status(400).json({error:"You cannot follow/unfollow yourself"});

        if(!userToModify || !currentUser) return res.status(400).json({error:"User not found"});

        const isFollowing = currentUser.following.includes(id);
        if(isFollowing){
            // Unfollow user
            // Modify cuurent user following, modify followers of userToModify
            await User.findByIdAndUpdate(req.user._id, {$pull:{following: id}});
            await User.findByIdAndUpdate(id, {$pull:{followers: req.user._id}});
            res.json({message:"User unfollowed Succefully"});
        }
        else{
            // Follow user
            await User.findByIdAndUpdate(req.user._id, {$push:{following: id}});
            await User.findByIdAndUpdate(id, {$push:{followers: req.user._id}});
            res.json({message:"User followed Succefully"});
        }

        
    } catch (err) {
        res.status(500).json({error: err.message})
        console.log("Error in FollowUnFollowUser: ", err.message)
    }
};

// Update User's detail
const updateUser = async (req, res)=>{
    const {name, email, username, password, profilePic, bio} = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if(!user) return res.status(400).json({error: "User not found"});
         if(req.params.id !== userId.toString()) return res.status(400).json({error: "You cannot update others"});

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        user.name = name || user.name;
        user.username = username || user.username;
        user.email = email || user.email;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();
        res.json({message: "Profile updated successfully", user});
        
    } catch (err) {
        res.status(500).json({error: err.message})
        console.log("Error in loginUser: ", err.message)
    }

}




export {getUserProfile, signupUser, loginUser , logoutUser, followUnfollowUser, updateUser};