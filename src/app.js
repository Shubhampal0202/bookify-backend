const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { dbConnect } = require("./config/dbConnect.js");
const PORT = process.env.PORT || 5000;

const userRouter = require("./routes/userRoutes.js");
const bookRouter = require("./routes/bookRoutes.js");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", userRouter);
app.use("/api/v1", bookRouter);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

dbConnect()
  .then(() => {
    console.log("Database is connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is listening at PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB Connection Failed ", err.message);
  });
