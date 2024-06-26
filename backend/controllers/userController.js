import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import bcrypt from 'bcryptjs';
import genTokenAndSetCookie from '../utils/helpers/genTokenAndSetCookie.js';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import asyncHandler from "express-async-handler";

// Get Users Profile
const getUserProfile = async (req, res)=>{
   
    //  Fetch user profile either with username or userId
    // query is either username or userId
    const {query} = req.params;
    try {
        let user;
        // query is userId
        if(mongoose.Types.ObjectId.isValid(query)){
            user = await User.findOne({_id: query}).select("-password").select("-updatedAt");
        } else{
            // query is username
             user =  await User.findOne({username: query}).select("-password").select("-updatedAt");
        }
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
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
        website: newUser.website
    });
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
         
        if(user.isFrozen){
            user.isFrozen = false;
            await user.save();
        }

        genTokenAndSetCookie(user._id, res);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic,
            website: user.website,

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
    
    const {name, email, username, password, bio, website} = req.body;
    let { profilePic } = req.body;
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

        if(profilePic){
            if(user.profilePic){
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }

            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadResponse.secure_url;
        }

        user.name = name || user.name;
        user.username = username || user.username;
        user.email = email || user.email;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio ;
        user.website = website;

        user = await user.save();

        // Find all posts that user replied and update username and userProfilePic fields
        await Post.updateMany(
            {"replies.userId": userId},
            {
              $set:{
                "replies.$[reply].username": user.username,
                "replies.$[reply].userProfilePic": user.profilePic

              }  
            },
            {arrayFilters:[{"reply.userId": userId}]}
        );


        user.password = null;
        
        res.json(user);
        
    } catch (err) {
        res.status(500).json({error: err.message})
        console.log("Error in Updating User: ", err.message)
    }

}

const getSuggestedUsers = async (req, res) => {
    try {
      //  Exclude current user and following users
        const userId = req.user._id;
        const usersFollowedByYou = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match:{
                    _id: {$ne: userId},
                }
            },
            {
                $sample: {size:10}
            }
        ])

        const filteredUsers = users.filter(user => !usersFollowedByYou.following.includes(user._id))
        const suggestedusers = filteredUsers.slice(0,4)

        res.json(suggestedusers);

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const freezeAccount = async (req, res) =>{
    try {
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        user.isFrozen = true;
        await user.save();

        res.json({success: true});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// /api/users?search=rahul977
const allUsers = asyncHandler(async (req, res) =>{
  const keyword = req.query.search ? {
    $or: [
        {name: {$regex: req.query.search, $options: "i"}},
        {username: {$regex: req.query.search, $options: "i"}},
    ]
  }
  : {};
  const users = await User.find(keyword).find({_id: {$ne: req.user._id}})
  res.send(users);
})

export {allUsers, getUserProfile, signupUser, loginUser , logoutUser, followUnfollowUser, updateUser, getSuggestedUsers, freezeAccount};