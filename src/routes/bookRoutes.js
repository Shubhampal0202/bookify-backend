const express = require("express");
const router = express.Router();
const {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
  getBookDetails,
  latestBooks,
} = require("../controllers/bookController");
const { verifyUser } = require("../middleware/auth");
const { authorizeUser } = require("../middleware/authorizeUser");
const { uploadSingle } = require("../middleware/multer");

router.post(
  "/admin/book",
  verifyUser,
  authorizeUser,
  uploadSingle("bookCover"),
  createBook,
);

router.get("/book", getAllBooks)

router.patch(
  "/admin/book/:id",
  verifyUser,
  authorizeUser,
  uploadSingle("bookCover"),
  updateBook,
);
router.delete(
  "/admin/book/:id",
  verifyUser,
  authorizeUser,
  deleteBook,
);
router.get("/book/:id", getBookDetails)
router.get("/latest-books", latestBooks)

module.exports = router;
