const express = require('express');
const router = express.Router();

router.get('/', (_req, res) => res.send('welcome from index'));

module.exports = router;