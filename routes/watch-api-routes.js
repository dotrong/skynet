var db = require("../models");

module.exports = function(app) {
    //create location with watch
    app.post("/api/locations", function(req, res) {

        db.Location.create(req.body, {
            include: [db.Watch]
        } ).then(function(dbLocation) {
          res.json(dbLocation);
        });
    });

};