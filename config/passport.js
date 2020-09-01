// @ts-ignore
const Localstrategy = require('passport-local').Strategy;
// @ts-ignore
const mongoose = require('mongoose');
// @ts-ignore
const bcrypt = require('bcryptjs');

// Load User Model
// @ts-ignore
const User = require('../models/User');
// @ts-ignore
module.exports = function(passport) {
    passport.use(
        // @ts-ignore
        new Localstrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match User
            User.findOne({ email: email })
            // @ts-ignore
            .then(user => {
                if(!user) {
                    return done(null, false, { message: 'That email is not registered'});
                }
                // Match Password
                // @ts-ignore
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect'});
                    }
                });
            })
            // @ts-ignore
            .catch(err => console.log(err))
        })
    );
    
    // @ts-ignore
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // @ts-ignore
    passport.deserializeUser((id, done) => {
        // @ts-ignore
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}