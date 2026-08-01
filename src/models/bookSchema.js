const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      minlength: [4, "Title must be atleast 4 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Book description is required"],
      trim: true,
      minlength: [10, "Description must be atleast 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    author: {
      type: String,
      required: [true, "Book author is required"],
      trim: true,
      minlength: [3, "Author must be atleast 3 characters"],
      maxlength: [100, "Author cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Programming",
          "Fiction",
          "Self Help",
          "Biography",
          "Science",
          "History",
          "Other",
        ],
        message: "{VALUE} is not a valid category",
      },
    },
    bookCoverUrl: {
      type: String,
     default:null
    },

    bookCoverUrlId: {
      type: String,
      default:null
    },
    price: {
      type: Number,
      required: [true, "Book price is required"],
      min: [0, "Book price can not be negative"],
    },
  },
  { timestamps: true },
);

const Book = mongoose.model("Book", bookSchema);
module.exports = { Book };
