// do not make changes to this file
const router = require('express').Router();
const jokes = require('./jokes-data');
const db = require('../../data/dbConfig');

router.get('/', (req, res) => {
  res.status(200).json(jokes);
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(500).json({
      note: 'An error occurred in the jokes router!',
      message: err.message,
      stack: err.stack
  });
});

module.exports = router;
