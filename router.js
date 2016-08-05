const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

//When user is authenticated, don't try to make a session for them
//because we are using tokens
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

module.exports = function(app) {
  app.get('/', requireAuth, function(req,res) {
    res.send('hi there');
  })
  app.post('/signup', Authentication.signup);
  app.post('/login', requireSignin, Authentication.login)
}