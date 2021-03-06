var authController = require('./controllers/authcontroller.js');

module.exports = function(app,passport){

app.get('/signup', authController.signup);


app.get('/', authController.signin);


app.post('/signup', passport.authenticate('local-signup',  { successRedirect: '/',
                                                    failureRedirect: '/signup'}
                                                    ));


app.get('/dashboard',isLoggedIn, authController.dashboard);
app.get('/watch',isLoggedIn, authController.watch);


app.get('/logout',authController.logout);


app.post('/signin', passport.authenticate('local-signin',  { successRedirect: '/dashboard',
                                                    failureRedirect: '/'}
                                                    ));


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}


}






