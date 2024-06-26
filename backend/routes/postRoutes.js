import express from "express";
import { createPost, deletePost, getPost, likeUnlikePost, replyToPost , getFeedPosts, getUserPosts, editPostCaptions} from "../controllers/postController.js";
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.post("/create", protectRoute, createPost);
router.get("/:id",  getPost);
router.get("/user/:username",  getUserPosts);
router.delete("/:id", protectRoute, deletePost);
router.post("/:id", protectRoute, editPostCaptions);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);

export default router;