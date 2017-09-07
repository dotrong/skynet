var db = require("../models");
var helper = require("../utils/helper");

module.exports = function(app) {

    app.post("/api/locations", function(req, res) {

         var promise1 = helper.customImg(req.body.city,req.body.state);
        promise1.then(function(response) {
            req.body.UserId = req.user.id;
            if (response) {
                req.body.picture = response; 
            } 
                db.Location.create(req.body, {
                    include: [db.Watch]
                } ).then(function(dbLocation) {
                    helper.runQuery();  
                    res.json(dbLocation);
                });
        })

    });
    //find all locations with watch
    app.get("/api/locations",function(req,res) {
        db.Location.findAll({

            include: [db.Watch]
        }).then(function(dbLocation) {
            res.json(dbLocation);
        })
    });

    //find all locations by user id
    app.get("/api/locations/users/:id",function(req,res) {
        db.User.findAll({
            where: {
                UserId: req.params.id
            }

        }).then(function(dbLocation) {
            res.json(dbLocation);
        })
    });
    //to delete a location by id
    app.post("/api/locations/:id", function(req, res) {

        db.Location.destroy({
            where: {
              id: req.params.id
            }
          }).then(function(dbLocation) {
            res.json(dbLocation);
        });

    });
};
