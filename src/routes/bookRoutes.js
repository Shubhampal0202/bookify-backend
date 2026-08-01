const express = require("express");
const router = express.Router();
const {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
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

router.get("/admin/book",getAllBooks)
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

module.exports = router;
