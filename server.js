var express = require('express');
var bodyParser = require("body-parser");
var db = require('./models');
var PORT = 3000;
var app = express();
var helper = require('./utils/helper');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static("./public"));

require("./routes/user-api-routes")(app);
require("./routes/location-api-routes")(app);


<<<<<<< HEAD
=======

>>>>>>> dotro
db.sequelize.sync().then(function(){

    app.listen(PORT,function(){

        console.log("Listening on port "+ PORT);
        setInterval(helper.runQuery,10000);

    })
});