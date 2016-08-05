const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt-nodejs');

const localOptions = { usernameField: 'email' }
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  //verify username and password
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err) }
    if (!user) { return done(null, false) }


    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err) }
      if (!isMatch) { return done(null, false) }

      return done(null, user);
    })
  })
    //if it is the correct combo, call done with user
    //if it is not, call done with false
})

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//payload is decoded JwtToken
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  //See if user id in payload matches one in our database
  User.findById(payload.sub, function(err, foundUser) {
    if (err) { return done(err, false); }
    if (foundUser) {
      done(null, foundUser);
    }
    else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);