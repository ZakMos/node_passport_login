// @ts-ignore
const express = require('express');
const router = express.Router();
// @ts-ignore
const { ensureAuthenticated } = require ('../config/auth');

// Welcome Page
// @ts-ignore
router.get('/', (_req, res) => res.render('welcome'));

// Dashboard Page
// @ts-ignore
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
        name: req.user.name
    }));

module.exports = router;