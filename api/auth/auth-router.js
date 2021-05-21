const router = require('express').Router();
const db = require('../../data/dbConfig');
const bcrypt = require('bcryptjs');
const tokenBuilder = require('../secrets/index');

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
    next({ status: 401, message: 'username taken' });
  }
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  const checkedUser = await db('users').where('username', username).first();
  req.user = await db('users').where('username', username).first();
  try {
    if (!username || !password) {
      next({ status: 401, message: 'username and password required' });
    } else if (checkedUser.username == username) {
      if (bcrypt.compareSync(password, req.user.password)) {
        const token = tokenBuilder(req.user);
        res.json({ message: `welcome, ${req.user.username}`, token: token });
      } else {
        next({ status: 401, message: 'invalid credentials' });
      }
    } else {
      next({ status: 401, message: 'invalid credentials' });
    }
  } catch (err) {
    next({ status: 401, message: 'invalid credentials' });
  }
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
    customMessage: 'Something went wrong inside the auth router'
  });
});

module.exports = router;
