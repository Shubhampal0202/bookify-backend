const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required"],
      minLength: [3, "Username must be at least 3 characters"],
      maxLength: [20, "Username can not be more than 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: function (props) {
          return `${props.value} is not a valid email address!`;
        },
      },
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
      minLength: [8, "password must be atleast 8 characters"],
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not a valid role",
      },
      default: "user",
    },
    profileUrl: {
      type: String,
      default: null,
    },
    profileUrlId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
