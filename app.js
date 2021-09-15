require("dotenv").config();
require("./config/passport");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const passport = require("passport");
const shopRoutes = require("./routes/shopRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const apiComment = require("./controllers/commentAPI");
const errorHandler = require("./controllers/errorController");
const detectUser = require("./middleware/detect-user");
const detectAdmin = require("./middleware/detect-admin");

const app = express();
const storeUser = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: "sessions",
});

const storeAdmin = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: "adsessions",
});

//storage image for user
const imageStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(file);
    if (file.fieldname === "userImage") {
      callback(null, "images/admin");
    } else if (file.fieldname === "imageUrl") {
      callback(null, "images/products");
    } else if (file.fieldname === "image") {
      callback(null, "images/user");
    }
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const imageFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(
  multer({
    storage: imageStorage,
    fileFilter: imageFilter,
  }).fields([
    {
      name: "imageUrl",
      maxCount: 3,
    },
    {
      name: "userImage",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
  ])
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

app.use(
  session({
    secret: process.env.COZA_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storeUser,
    cookie: {
      maxAge: 180 * 60 * 1000,
    },
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storeAdmin,
    cookie: {
      maxAge: 180 * 60 * 1000,
    },
  })
);

app.use(detectUser);
app.use(detectAdmin);

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/admin", adminRoutes);

app.use("/admin", adminAuthRoutes);

app.use(shopRoutes);

app.use(userAuthRoutes);

app.use(apiComment);

app.use("/admin", errorHandler.render404ForAdmin);

app.use(errorHandler.render404ForUser);

mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => {
    app.listen(process.env.PORT || 3000);
    console.log("Connected to Database");
  })
  .catch((err) => console.log(err));
