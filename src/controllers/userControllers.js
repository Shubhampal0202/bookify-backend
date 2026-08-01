const { User } = require("../models/userSchema");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");


async function createUser(req, res) {
  console.log(req.body);
  try {
    const { username, email, password } = req.body;
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (password.length < 8 || password.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 8 and 20 characters",
      });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exist" });
    }
    let saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ email, username, password: hashedPassword });
    await user.save();
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (err) {
    console.log("Error", err.message);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }

    if (err.code === 11000) {
      // Handle duplicate key error caused by race condition
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      return res.status(400).json({
        success: false,
        message: `${field} "${value}" already exist`,
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

async function signin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const userExist = await User.findOne({ email: email.toLowerCase().trim() });
    if (!userExist) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong credentials" });
    }
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong credentials" });
    }
    const token = generateToken({ id: userExist._id }, { expiresIn: "1d" });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "LoggedIn successfully",
        user: {
          username: userExist.username,
          email: userExist.email,
          role: userExist.role,
          profileUrl: userExist.profileUrl,
        },
      });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "You are logged out successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function getProfile(req, res) {
  console.log("profie called");

  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      message: "Profile data",
      user: {
        username: user.username,
        email: user.email,
        profileUrl: user.profileUrl,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { createUser, signin, logout, getProfile };
