const express = require("express");
const {
  createUser,
  signin,
  logout,
  getProfile,
} = require("../controllers/userControllers");
const { verifyUser } = require("../middleware/auth");
const router = express.Router();

// user routes

router.post("/user/signup",createUser);
router.post("/user/signin",signin);
router.post("/user/logout",logout);
router.get("/user/me", verifyUser, getProfile);



module.exports = router;
