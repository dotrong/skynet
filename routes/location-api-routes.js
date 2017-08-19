var db = require("../models");

module.exports = function(app) {

    app.post("/api/locations", function(req, res) {

        db.Location.create(req.body, {
            include: [db.Watch]
        } ).then(function(dbLocation) {
          res.json(dbLocation);
        });
    });

    app.get("/api/locations",function(req,res) {
        db.User.findAll({
            //include: [db.Location, {include:[db.Watch]}]
            include: [db.Watch]
        }).then(function(dbUser) {
            res.json(dbUser);
        })
    });
};

// models.Survey.create(survey,{
//     include:  [models.Question,{include: [models.Option]}]
//   }).then(function() {
// reply({success:1});
// });

// survey = {
//     title: title,
//     description: description,
//     Questions:[
//       {
//         question_type: 'Radio',
//         question: 'q1',
//         Options:[
//           {
//             option: 'o1'
//           },
//           {
//             option: 'o2'
//           }
//         ]
//       }
//     ]
//   }