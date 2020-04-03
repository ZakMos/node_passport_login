const express = require('express');
const router = express.Router();

// Welcome Page
router.get('/', (_req, res) => res.render('welcome'));

// Dashboard Page
router.get('/dashboard', (req, res) => res.render('dashboard'));

module.exports = router;