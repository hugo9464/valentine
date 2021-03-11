const express = require("express");
const path = require("path");
const morgan = require("morgan");
// if (process.env.NODE_ENV === "dev") require("./.secrets");
// Create the server
const app = module.exports = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

if (process.env.NODE_ENV === 'dev')
require('dotenv').config({ path: 'config.env' });
// const dotenv = require('dotenv').config({ silent: process.env.NODE_ENV === 'production' })
const session = require('express-session');
const bodyParser = require('body-parser');

app.use(morgan("tiny")); // logging framework
console.log("toto")
console.log(process.env.NODE_ENV, process.env.SESSION_SECRET);

app.use(helmet());
app.use(cookieParser());

// app will not work without setting up the config.env file
// https://belugajs.com/docs/new-store
// if (dotenv.error) throw dotenv.error;

var sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: false
  },
  resave: false,
  saveUninitialized: true,
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}

app.use(session(sess))
app.use(bodyParser.json());

// Serve our api message
app.get("/api/message", async (req, res, next) => {
  try {
    res.status(201).json({ message: "Hello From Express!!" });
  } catch (err) {
    next(err);
  }
});


require(__dirname + '/api/product.js');
require(__dirname + '/api/orders.js');
require(__dirname + '/api/admin.js');
require(__dirname + '/api/config.js');

if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  app.use(express.static("build"));
  app.get("/*", (req, res) => res.sendFile(path.resolve("build", "index.html")));
}

if (process.env.NODE_ENV === "dev") {
  // Express will serve up production assets
  app.use(express.static("public"));
  app.get("/*", (req, res) =>
    res.sendFile(path.resolve("public", "index.html"))
  );
}

// Express will serve up the front-end index.html file if it doesn't recognize the route

// Choose the port and start the server
const PORT = process.env.PORT || 5000   ;
app.listen(PORT, () => {
  console.log(`Mixing it up on port ${PORT}`);
});
