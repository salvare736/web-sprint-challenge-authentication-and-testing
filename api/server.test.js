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
  await request(server).post('/api/auth/register').send({ username: 'josie', password: "1234" });
  users = await db('users');
  expect(users).toHaveLength(1);
});

test('[POST] /api/auth/register - responds with newly added user', async () => {
  let users = await db('users');
  expect(users).toHaveLength(0);
  const res = await request(server).post('/api/auth/register').send({ username: 'josie', password: "1234" });
  expect(res.body.id).toEqual(1);
  expect(res.body.username).toEqual('josie');
  expect(res.body.password).toBeDefined();
});

test('[POST] /api/auth/login - delivers welcome message upon login', async () => {
  let users = await db('users');
  expect(users).toHaveLength(0);
  await request(server).post('/api/auth/register').send({ username: 'josie', password: "1234" });
  const res = await request(server).post('/api/auth/login').send({ username: 'josie', password: "1234" });
  expect(res.body.message).toEqual('welcome, josie');
})

test('[POST] /api/auth/login - delivers proper status code upon successful login', async () => {
  let users = await db('users');
  expect(users).toHaveLength(0);
  await request(server).post('/api/auth/register').send({ username: 'josie', password: "1234" });
  const res = await request(server).post('/api/auth/login').send({ username: 'josie', password: "1234" });
  expect(res.status).toEqual(200);
})

test('[GET] /api/jokes - hitting this endpoint without a token is unauthorized', async () => {
  const res = await request(server).get('/api/jokes')
  expect(res.unauthorized).toEqual(true);
});

test('[GET] /api/jokes - hitting this endpoint without a token returns the proper status code', async () => {
  const res = await request(server).get('/api/jokes')
  expect(res.status).toEqual(401);
});
