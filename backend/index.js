const express = require("express");
const app = express();
const cors = require("cors");
const dbConnection = require("./connection/db");
const logger = require("morgan");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");

dbConnection();

app.listen(4000, () => {
  console.log("Server started on PORT 4000");
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", userRouter);
app.use("/admin", adminRouter);
