import User from '../models/userModel.js';
import Post from '../models/postModel.js';

import { v2 as cloudinary } from 'cloudinary';

// Create Post
const createPost = async (req, res)=>{

    try {
        const {postedBy, text} = req.body;
        let {img} = req.body;
        if(!postedBy || !text){
            return res.status(400).json({error: "Postedby and text fields are required"});
        }
        const user = await User.findById(postedBy);
        if(!user){
            return res.status(400).json({error: "User not found"});
        }

        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({error: "Unauthorized to create post"});
        }
        const maxLength = 500;
        if(text.length > maxLength){
            return res.status(400).json({error: `Text must be less than ${maxLength} characters`});
        }

        if(img){
            const uploadResponse = await cloudinary.uploader.upload_large(img,
                {resource_type: "auto"},
            );
            img = uploadResponse.secure_url;
        }

        const newPost = new Post({postedBy, text, img });
        await newPost.save();

        res.status(201).json(newPost );

        
    } catch (err) {
        res.status(500).json({error: err.message})
        console.log("Error in createPost: ", err.message)
    }
}

// Get Post
const getPost = async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            res.status(404).json({error: "Post not found"})
        }
        
        res.json(post)

    } catch (err) {
        res.status(500).json({error: err.message})
        console.log("Error in getPost: ", err.message)
    }
}

// Delete Post
const deletePost = async (req, res)=>{
   try {
    const post = await Post.findById(req.params.id);
    if(!post){
       return res.status(404).json({error: "Post not found"});
    }
    if(post.postedBy.toString() !== req.user._id.toString()){
        return res.status(401).json({error: "Unauthorized to delete post"});
    }

    if(post.img){
       const imgId = post.img.split("/").pop().split(".")[0]; 
       await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);
    
    return res.json({message : "Post delete successfully"});


   } catch (err) {
    res.status(500).json({error: err.message})
    console.log("Error in getPost: ", err.message)
   }
}

//Edit Posts
const editPostCaptions = async (req, res) =>{
    try {
        
        const {text} = req.body;
        let post = await Post.findById(req.params.id);
        if(!post){
           return res.status(404).json({error: "Post not found"});
        }
        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(401).json({error: "Unauthorized to edit post"});
        }
    
        post.text = post.text || text;
    
        post = await post.save();
    
        res.json(post)  ;
    

    } catch (err) {
        res.status(500).json({error: err.message})
        console.log("Error in ediyPostCaptions: ", err.message)
    }
  
}


// Like Unlike Post
const likeUnlikePost = async (req, res)=>{
  try {
    const {id: postId} = req.params; // Renaming id to postId or write this [ const postId = req.params; ]
    const userId = req.user._id;
    const post = await Post.findById(postId);

    if(!post){
       return res.status(404).json({error:"Post not found"});
    }
    const userLikedPost = post.likes.includes(userId);
    if(userLikedPost){
        // Unlike Post
     await Post.updateOne({_id:postId},{$pull:{likes: userId}});
     res.json({message :"Post unliked successfully"});
    } else{
        // Like Post
        post.likes.push(userId);
        await post.save();
        res.json({message :"Post liked successfully"});

    }
    
  } catch (err) {
    res.status(500).json({error: err.message})
    console.log("Error in getPost: ", err.message)
  }
}

// Reply to Post
const replyToPost = async (req, res) =>{
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if(!text){
            return res.status(400).json({error: "Text field is required"});
        }
        
        const post = await Post.findById(postId);
        if(!post){
           return res.status(404).json({error: "Post not found"});
        }

        const reply = {text,userId, userProfilePic, username};
        post.replies.push(reply);
        await post.save();

        res.json(reply); 



    } catch (err) {
        res.status(500).json({error: err.message})
        console.log("Error in replyPost: ", err.message)
    }
};

// Feed Posts
const getFeedPosts = async (req, res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
    
        const following = user.following;
        
        const feedPosts = await Post.find({postedBy: {$in: following}}).sort({createdAt: -1});

        res.json(feedPosts);

        
    } catch (err) {
        res.status(500).json({error: err.message})
        console.log("Error in getFeed: ", err.message)
    }
}

//
const getUserPosts = async (req, res) =>{
    const { username } = req.params;
    try {
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        const posts = await Post.find({postedBy: user._id}).sort({ createdAt: -1});
        res.json(posts);
        
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}




export {createPost, getPost , deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts, editPostCaptions};