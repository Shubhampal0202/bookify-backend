const JWT = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

function generateToken(payload, validity) {
  return JWT.sign(payload, secretKey, validity);
}

function verifyToken(token) {
 return JWT.verify(token, secretKey);
}

module.exports = { generateToken, verifyToken };
