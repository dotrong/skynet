var db = require("../models");

module.exports = function(app) {

    //create a user

    app.post("/api/users", function(req, res) {
        db.User.create(req.body).then(function(dbUser) {
          res.json(dbUser);
        });
    });
    //get a list of users and all locations information

    app.get("/api/users/all",function(req,res) {

        //if (req.user) {

            db.User.findAll({
                //include: [db.Location, {include:[db.Watch]}]
                include: [{model: db.Location,
                    include:[{model: db.Watch, include: [db.Alert]}]}]
            }).then(function(dbUser) {
                res.json(dbUser);
            })

        //}
        // else {
        //     res.render("signin");
        // }
        

    });
    //get location, watch, alert information for a userid
    app.get("/api/users",function(req,res) {

        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
          }
          else {
            // Otherwise send back the user's email and id
            // Sending back a password, even a hashed password, isn't a good idea
            db.User.findOne({
                //include: [db.Location, {include:[db.Watch]}]
                include: [{model: db.Location,
                    include:[{model: db.Watch, include: [db.Alert]}]}],
                    where: {
                        id: req.user.id
                    }
            }).then(function(dbUser) {
                res.json(dbUser);
            })
          }

    });
    //delete a user
    app.delete("/api/users/:id", function(req, res) {
        db.User.destroy({
          where: {
            id: req.params.id
          }
        }).then(function(dbAuthor) {
          res.json(dbAuthor);
        });
      });
};
