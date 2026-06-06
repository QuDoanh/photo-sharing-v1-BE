const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const dbConnect = require("./db/dbConnect");
const authMiddleware = require("./middleware/authMiddleware");
const AdminRouter = require("./routes/AdminRouter");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const RegisterRouter = require("./routes/RegisterRouter");
const { addComment, uploadPhoto } = require("./controller/photoController");

const app = express();

dbConnect();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "images"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/admin", AdminRouter);
app.use("/user", RegisterRouter);

app.use(authMiddleware);

app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);
app.post("/commentsOfPhoto/:photo_id", addComment);
app.post("/photos/new", upload.single("uploadedphoto"), uploadPhoto);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

const server = app.listen(8081, () => {
  console.log("server listening on port 8081");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log("Port 8081 đang được dùng. Tắt server cũ rồi chạy lại.");
  } else {
    console.log(err);
  }
});
