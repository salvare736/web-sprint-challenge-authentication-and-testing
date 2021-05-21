const router = require('express').Router();
const jokes = require('./jokes-data');
const { restricted } = require('../middleware/restricted');

router.get('/', restricted, (req, res, next) => {
  res.status(200).json(jokes);
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
    customMessage: 'Something went wrong inside the jokes router'
  });
});

module.exports = router;
