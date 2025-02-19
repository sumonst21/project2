// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var path = require("path")

var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");

// Compress
var compression = require('compression')


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8090;

// compress all responses
app.use(compression())

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main",
  //layoutsDir: path.join(__dirname, 'views')
}));
app.set("view engine", "handlebars");

// Static directory
app.use(express.static("public"));

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
// =============================================================
require("./routes/html-routes.js")(app);
require("./routes/user-api-routes.js")(app);
require("./routes/book-api-routes.js")(app);
require("./routes/shoppingcart-api-routes.js")(app);
require("./routes/purchase-api-routes.js")(app);

// Syncing our sequelize models and then starting our Express app
// =============================================================
/* { force: true } */
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
