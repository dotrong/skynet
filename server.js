var express = require('express');
var bodyParser = require("body-parser");
//add for authentication
var passport   = require('passport');
var session    = require('express-session');
//end

var db = require('./models');
var PORT = 3000;
var app = express();
var helper = require('./utils/helper');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Add authentication
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
//end

// Static directory
app.use(express.static("./public"));

require("./routes/user-api-routes")(app);
require("./routes/location-api-routes")(app);
//add for authentication
var authRoute = require('./app/routes/auth.js')(app);
//end

db.sequelize.sync().then(function(){

    app.listen(PORT,function(){

        console.log("Listening on port "+ PORT);
        setInterval(helper.runQuery,10000);

    })
});