var db = require("../models");

module.exports = function(app) {

    //create alert
    app.post("/api/alerts", function(req, res) {

        db.Alert.create(req.body).then(function(dbAlert) {
          res.json(dbAlert);
        });
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