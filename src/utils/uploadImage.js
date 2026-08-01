const cloudinary = require("../config/cloudinary");
async function uploadImage(fileBufferData) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "bookify/books/bookCover",
      },

      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      },
    );
    stream.end(fileBufferData);
  });
}
module.exports = { uploadImage };
