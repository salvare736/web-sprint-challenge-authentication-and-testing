const router = require('express').Router();
const db = require('../../data/dbConfig');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  const checkedUser = await db('users').where('username', username);
  try {
    if (!username || !password) {
      next({ status: 401, message: 'username and password required' });
    } else if (checkedUser.username == username) {
      next({ status: 401, message: 'username taken' });
    } else {
      const hash = bcrypt.hashSync(
        password,
        8
      );
      const [id] = await db('users').insert({ username, password: hash });
      const newUser = await db('users').where('id', id).first();
      res.status(201).json(newUser);
    }
  } catch (err) {
    next(err);
  }
});

router.post('/login', (req, res) => {
  res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(500).json({
      note: 'An error occurred in the auth router!',
      message: err.message,
      stack: err.stack
  });
});

module.exports = router;
