/**
 * Configuration functions for the middleware 'Passport'
 */
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const login = require('./../../db/login')

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user)
});

// Login authentication and session
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
function(username, password, done) {
  let email = username
  login.getUserWithEmail(email)
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((isPassword) => {
          if(isPassword) {
            delete user.password
            return done(null, user)
          } else {
            return done(null, false)
          }
        })
        .catch((error) => {
          // failed to compare passwords
          console.log(error)
          done(null, false)
        })
    })
    .catch((err) => {
      console.log(err)
      done(null, false)
    })
}
));

module.exports = passport;