const JWT = require("jsonwebtoken");
const { verifyToken } = require("../utils/generateToken");
const { User } = require("../models/userSchema");

async function verifyUser(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Token missing, please login",
      });
    }
    const decoded = verifyToken(token);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication failed" });
    }
    req.user = user;
    console.log(user)
    return next();
  } catch (err) {
    console.log("err", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired, please login again",
      });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}



module.exports = { verifyUser };
