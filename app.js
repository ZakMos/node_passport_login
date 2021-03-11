// @ts-nocheck
if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyparser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

// Password config
require('./config/passport')(passport);

// DB Config
// const db = require('./config/keys').DB_CONNECT;

// Connect to Mongo 
mongoose.connect(process.env.DATABASE_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(bodyparser.urlencoded({ extended: false }));

// Express session
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true
    })
  );

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

  
  // Connect flash
  app.use(flash());
  
  // Global variables
  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });


// Routes
app.use('/', require ('./routes/index'));
app.use('/users', require ('./routes/users'));

// Not Found Page
app.use((req, res, next) => {
  res.status(404).send('<h1>Page Not Found</h1>');
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));