const dotenv = require('dotenv').config({ path: 'config.env' });
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const app = module.exports = express();

const morgan = require("morgan");
// if (process.env.NODE_ENV === "dev") require("./.secrets");
// Create the server
app.use(morgan("tiny")); // logging framework
console.log(process.env.NODE_ENV, process.env.SECRET);

app.use(helmet());
app.use(cookieParser());

// app will not work without setting up the config.env file
// https://belugajs.com/docs/new-store
if (dotenv.error) throw dotenv.error;

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

require(__dirname + '/product.js');
require(__dirname + '/orders.js');
require(__dirname + '/admin.js');
require(__dirname + '/config.js');

if (process.env.NODE_ENV === "production") {
    // Express will serve up production assets
    app.use(express.static("build"));
    app.get("/*", (req, res) => res.sendFile(path.resolve("build", "index.html")));
  }
  
if (process.env.NODE_ENV === "dev") {
// Express will serve up production assets
app.use(express.static("public"));
app.get("*", (req, res) =>
    res.sendFile(path.resolve("public", "index.html"))
);
}

// Express will serve up the front-end index.html file if it doesn't recognize the route

// Choose the port and start the server
const PORT = process.env.PORT || 5000   ;
app.listen(PORT, () => {
console.log(`Mixing it up on port ${PORT}`);
});