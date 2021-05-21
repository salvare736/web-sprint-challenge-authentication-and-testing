const db = require('../data/dbConfig');
const request = require('supertest');
const server = require('./server');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db('users').truncate();
});
afterAll(async () => {
  await db.destroy();
});

test('sanity', () => {
  expect(true).toBe(true);
});

describe('Users', () => {
  describe('[POST] /api/auth/register', () => {
    it.todo('adds user into db');
    it.todo('responds with newly added user');
  });
  describe('[POST] /api/auth/login', () => {
    it.todo('logs in the user with token');
    it.todo('responds with logged in user');
  });
  describe('[GET] /api/jokes', () => {
    it.todo('returns list of jokes');
    it.todo('fails to return list of jokes if not logged in');
  });
});
