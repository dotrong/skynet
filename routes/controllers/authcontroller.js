var exports = module.exports = {}
var path = require("path");

exports.signup = function(req,res){

  //res.render('signup'); 
  res.sendFile(path.join(__dirname + "/../../public/user.html"));

}

exports.signin = function(req,res){

  //res.render('/'); 
  res.sendFile(path.join(__dirname + "/../../public/index.html"));

}
exports.watch = function(req,res){
  
    //res.render('/'); 
    //res.sendFile(path.join(__dirname + "/../../public/watch.html"));

    res.render('watch',{username:req.user.firstname}); 
  
  }

exports.dashboard = function(req,res){
  console.log(req.user);

  res.render('dashboard',{username:req.user.firstname}); 
  
  //res.sendFile(path.join(__dirname + "/../../public/location.html"));

}

exports.logout = function(req,res){

  req.session.destroy(function(err) {
    res.redirect('/');
  //res.sendFile(path.join(__dirname + "/../../public/index.html"));
  });

}