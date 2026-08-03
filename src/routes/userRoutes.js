const express = require("express");
const {
  createUser,
  signin,
  logout,
  getAuth,
  getProfile,
} = require("../controllers/userControllers");
const { verifyUser } = require("../middleware/auth");
const router = express.Router();

// user routes

router.post("/user/signup",createUser);
router.post("/user/signin",signin);
router.post("/user/logout",logout);
router.get("/user/me", verifyUser, getAuth);
router.get("/user/profile", verifyUser, getProfile);



module.exports = router;
