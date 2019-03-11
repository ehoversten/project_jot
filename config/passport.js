// Authentication (login) Strategy
// const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// const LOCAL_STRATEGY_CONFIG = {
//     usernameField: 'email',
//     passwordField: 'password',
//     session: false,
//     passReqToCallback: true
// };

// Load User Model
const User = mongoose.model('users');

// Export Module
module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        // Match -> Find User
        User.findOne({
            email: email
        }).then(user => {
            if(!user){
                return done(null, false, {message: 'No User Found'});
            }

            // Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password Incorrect'});
                }
            })
        })
        // console.log(email);
        // console.log(password);
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}