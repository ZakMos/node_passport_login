// @ts-ignore
const express = require('express');
const router = express.Router();
// @ts-ignore
const bcrypt = require('bcryptjs');
// @ts-ignore
const passport = require('passport');

// User model
// @ts-ignore
const User = require('../models/User');

// Login Page
// router.get('/login', (req, res) => { 
//   if(req.session.user){
//     res.redirect("/dashboard");
//   } else {
//     res.render("/dashboard");
//   }
// })
// @ts-ignore
router.get('/login', (req, res) => res.render("login"));

// Register Page
// @ts-ignore
router.get('/register', (req, res) => res.render("register"));

// Register Handle
// @ts-ignore
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    // @ts-ignore
    let errors = [];

    // Check required fields 
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' })
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
       // @ts-ignore
       .then(user => {
          if (user) {
            // User exists
            errors.push({ msg: 'Email already exists' });
            res.render('register', {
              // @ts-ignore
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
                // @ts-ignore
                bcrypt.genSalt(10, (err, salt) => {
                  // @ts-ignore
                  bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    //Set Password to hashed
                    newUser.password = hash;
                    // Save User
                    newUser.save()
                    // @ts-ignore
                    .then(user => {
                      req.flash(
                        'success_msg', 
                        'You are now registered and can log in');
                      res.redirect('/users/login');
                    })
                    // @ts-ignore
                    .catch(err => console.log(err));
                  });
                });
              }
            });
          }
        });

// Login Handle
// @ts-ignore
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
})

// Logout Handle
// @ts-ignore
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;