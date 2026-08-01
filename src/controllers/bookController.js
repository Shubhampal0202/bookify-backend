const { config } = require("dotenv");
const { Book } = require("../models/bookSchema");
const { options } = require("../routes/bookRoutes");
const { uploadImage } = require("../utils/uploadImage");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

async function createBook(req, res) {
  try {
    const { title, description, author, price, category } = req.body;
    console.log(title, description, author, price, category);
    const file = req.file;
    console.log(file);
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Book cover image is required",
      });
    }

    const book = new Book({
      title: title,
      description: description,
      author: author,
      category: category,
      price: price,
    });
    await book.validate();
    let result;

    try {
      result = await uploadImage(file.buffer);
      console.log("result", result);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "File upload failed. Please try again",
      });
    }
    book.bookCoverUrl = result.secure_url;
    book.bookCoverUrlId = result.public_id;

    await book.save();
    return res
      .status(201)
      .json({ success: true, message: "Book created successfully" });
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server Error" });
  }
}

async function getAllBooks(req, res) {
  try {
    let { currentPage, limit, search, category } = req.query;
    console.log(currentPage, limit, search);
    currentPage = Number(currentPage) || 1;
    currentPage = currentPage < 1 ? 1 : currentPage;
    limit = Number(limit) || 2;
    limit = Math.min(limit, 2);
    limit = limit < 1 ? 1 : limit;

    let filter = {};
    if (search?.trim()) {
      filter.$or = [
        {
          title: { $regex: search, $options: "i" },
        },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category?.trim()) {
      filter.category = {
        $regex: category,
        $options: "i",
      };
    }
    console.log(filter);
    const skip = (currentPage - 1) * limit;
    console.log(currentPage, limit, skip);
    const totalBooks = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalBooks / limit);
    const books = await Book.find(filter)
      .select(
        "_id title description author category bookCoverUrl createdAt price",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return res.status(200).json({
      success: true,
      message: "Get Books",
      books,
      totalBooks,
      totalPages,
      currentPage,
      limit,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

async function updateBook(req, res) {
  try {
    const { title, description, author, category, price } = req.body;
    const file = req.file;
    console.log(file);
    console.log(req.params.id);
    const bookId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book id",
      });
    }
    let book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    const categoryArray = [
      "Programming",
      "Fiction",
      "Self Help",
      "Biography",
      "Science",
      "History",
      "Other",
    ];
    if (category) {
      if (!categoryArray.includes(category)) {
        return res
          .status(400)
          .json({ success: false, message: "category is not valid" });
      } else {
        book.category = category;
      }
    }
    if (title) {
      book.title = title;
    }
    if (description) {
      book.description = description;
    }
    if (author) {
      book.author = author;
    }
    if (price !== undefined) {
      book.price = price;
    }
    await book.validate();

    if (file) {
      let result;
      try {
        result = await uploadImage(file.buffer);
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "File upload failed. Please try again",
        });
      }

      if (book.bookCoverUrlId) {
        await cloudinary.uploader
          .destroy(book.bookCoverUrlId)
          .catch((err) => console.log("Error in deleting image", err.message));
      }

      book.bookCoverUrl = result.secure_url;
      book.bookCoverUrlId = result.public_id;
    }
    await book.save();
    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      bookData: {
        title: book.title,
        description: book.description,
        author: book.author,
        price: book.price,
        category: book.category,
        bookCoverUrl: book.bookCoverUrl,
        createdAt: book.createdAt,
      },
    });
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

async function deleteBook(req, res) {
  try {
    const bookId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book id",
      });
    }
    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    if (book.bookCoverUrl && book.bookCoverUrlId) {
      await cloudinary.uploader
        .destroy(book.bookCoverUrlId)
        .catch((err) => console.log("Error in deleting image", err.message));
    }
    await book.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: "Book deleted successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { createBook, getAllBooks, updateBook, deleteBook };
