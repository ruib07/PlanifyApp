const request = require('supertest');

const app = require('../src/app');

test('Test if it is resolving at the root', () => request(app).get('/')
  .then((res) => {
    expect(res.status).toBe(200);
  }));
