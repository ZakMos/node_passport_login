// @ts-nocheck
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
// router.get('/login', (req, res) => { 
//   if(req.session.user){
//     res.redirect("/dashboard");
//   } else {
//     res.render("/dashboard");
//   }
// })
router.get('/login', forwardAuthenticated, (req, res) => res.render("login"));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render("register"));

// Register Handle
router.post('/register',(req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    if(name.length < 3) {
      errors.push({ msg: 'User Name should be at least 3 characters' })
    }
    // Check required fields 
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' })
    }
    // Check email validation 
     if(email.length <= 7 || email.length > 254) {
      errors.push({ msg: 'Please enter a valid email'})
    }

    // Check Passwords match
    if(password !== password2) {
        errors.push({ msg: 'Password do not match' })
    }

    // Check Password length
    if(password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters'})
    }
    if (errors.length > 0) {
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        // Validation passed 
        User.findOne({ email: email })
       .then(user => {
          if (user) {
            // User exists
            errors.push({ msg: 'Email already exists' });
            res.render('register', {
              errors,
              name,
              email,
              password,
              password2
            });
          } else {
            const newUser = new User({
              name,
              email,
              password
            });

                //Hash Password
                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    //Set Password to hashed
                    newUser.password = hash;
                    // Save User
                    newUser.save()
                    .then(user => {
                      req.flash(
                        'success_msg', 
                        'You are now registered and can log in');
                      res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                  });
                });
              }
            });
          }
        });

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
})

// Logout Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;