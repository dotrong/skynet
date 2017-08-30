var db = require("../models");

module.exports = function(app) {

    //create alert: in body must have watchId information
    app.post("/api/alerts", function(req, res) {

        db.Alert.findOne({
            where: {
                WatchId: req.body.WatchId,
                status: 1
            }
         }).then(function(dbAlert) {
             //res.json(dbUser);
             return dbAlert;
         }).then(function(dbAlert){
            if (dbAlert) {
                return db.Alert.update(req.body, { where: {WatchId: req.body.WatchId}});
            }
            else {
                return db.Alert.create(req.body);
            }
         }).then(function(alert) {res.json(alert);
        }).catch(function(error){console.log(error);});

    });

    //update alert status by id
    app.put("/api/alerts/:id", function(req, res) {
        
        db.Alert.update(req.body, 
            {
                where: {
                    id:req.body.id
                }
            }).then(function(dbAlert) {

            res.json(dbAlert);

        });
    });
    //find all alert by WatchId
    app.get("/api/alerts/watches/:id",function(req,res) {
        db.User.findAll({
           where: {
               WatchId: req.params.id
           }
        }).then(function(dbUser) {
            res.json(dbUser);
        })
    });
};