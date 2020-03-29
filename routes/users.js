const express = require('express')
const router = express.Router();

// Login Page
router.get('/login', (_req, res) => res.send("hello from user page"));


// Register Page
router.get('/register', (_req, res) => res.send("hello from register"));

module.exports = router;