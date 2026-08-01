const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedType = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowedType.includes(file.mimetype)) {
      return cb(new Error("Only png, jpg and jpeg format are allowed"));
    }
    cb(null, true);
  },
});

function uploadSingle(fileName) {
  return (req, res, next) => {
    upload.single(fileName)(req, res, (err) => {
      if (!err) {
        return next();
      }
      let message = err.message;
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          message = "File size more than 2 MB is not allowed";
          return res.status(400).json({ success: false, message });
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
          message = "Invalid file field name";
          return res.status(400).json({ success: false, message });
        }
      }
      return res.status(400).json({ success: false, message: message });
    });
  };
}
module.exports = { uploadSingle };
