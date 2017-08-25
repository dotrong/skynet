var express = require('express');
var bodyParser = require("body-parser");
//add for authentication
var passport   = require('passport');
var session    = require('express-session');
var exphbs     = require('express-handlebars')
var path = require('path');
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
     //For Handlebars
app.set('views', './public/views')
app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

require("./routes/user-api-routes")(app);
require("./routes/location-api-routes")(app);
//add for authentication

//var authRoute = require('./routes/auth.js')(app,passport);
require('./routes/auth.js')(app,passport);
//load passport strategies
require('./config/passport/passport.js')(passport,db.User);
//end

db.sequelize.sync().then(function(){

    app.listen(PORT,function(){

        console.log("Listening on port "+ PORT);
       // setInterval(helper.runQuery,10000);

    })
});