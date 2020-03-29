const express = require('express')
const router = express.Router();

// Login Page
router.get('/login', (_req, res) => res.render("login"));


// Register Page
router.get('/register', (_req, res) => res.render("register"));

module.exports = router;