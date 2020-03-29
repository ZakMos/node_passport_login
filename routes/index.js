const express = require('express');
const router = express.Router();

router.get('/', (_req, res) => res.render('welcome'));

module.exports = router;