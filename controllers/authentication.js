const User = require('../models/user');
const config = require('../config');
const jwt = require('jwt-simple');

function tokenGen(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
};

module.exports = {
  signup: function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(422).send({error:"You must submit a username and password"})
    }

    // See if a user already exists
    User.findOne({email: email}, function(err, existingUser) {
    // if user exists, return err
      if(err) {
        return next(err)
      }
    // if new user, create and save user record
      if(existingUser) {
        return res.status(422).send({error: "Email is in use"});
      }
    //respond to request indicating user was created
      const user = new User({
        email: email,
        password: password
      });
      user.save(function(err) {
        if (err) {
          return next(err);
        }
        res.json({token: tokenGen(user)});
      });
    })
  },
  login: function(req, res, next){
    //User has already had their email and password auth'd
    res.send({token: tokenGen(req.user) })
    //Give them a token
  }
}