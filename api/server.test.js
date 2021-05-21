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

test('[POST] /api/auth/register - adds user into db', async () => {
  let users = await db('users');
  expect(users).toHaveLength(0);
  await db('users').insert({ username: 'josie', password: "1234" });
  users = await db('users');
  expect(users).toHaveLength(1);
  console.log(users[0]);
});

test('[POST] /api/auth/register - responds with newly added user', async () => {
  let users = await db('users');
  expect(users).toHaveLength(0);
  const res = await request(server).post('/api/auth/register').send({ username: 'josie', password: "1234" });
  expect(res.body.id).toEqual(1);
  expect(res.body.username).toEqual('josie');
  expect(res.body.password).toBeDefined();
});

