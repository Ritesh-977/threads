import express from "express";
import { followUnfollowUser, getUserProfile, loginUser, logoutUser, signupUser, updateUser, getSuggestedUsers, freezeAccount, allUsers} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute,followUnfollowUser);
router.put("/update/:id", protectRoute,updateUser);
router.put("/freeze",protectRoute, freezeAccount);

//
router.route("/").get(protectRoute, allUsers);

export default router;
 