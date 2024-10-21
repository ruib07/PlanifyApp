const request = require('supertest');
const uuid = require('uuid');

const app = require('../../src/app');

const signinRoute = '/auth/usersignin';
const signupRoute = '/auth/usersignup';
const byIdRoute = '/v1/users/:Id';

const generateUniqueEmail = () => `${uuid.v4()}@gmail.com`;

test('Test #10 - Receiving token when a user authenticates', () => {
  const userEmail = generateUniqueEmail();

  return app.services.user.save({
    Name: 'Rui Auth',
    Email: userEmail,
    Password: 'Rui@Barreto-123',
  })
    .then(() => request(app).post(signinRoute)
      .send({
        Email: userEmail,
        Password: 'Rui@Barreto-123',
      }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('userToken');
    });
});

test('Test #11 - Wrong authentication attempt for users', () => {
  const userEmail = generateUniqueEmail();

  return app.services.user.save({
    Name: 'Rui Auth',
    Email: userEmail,
    Password: 'Rui@Barreto-123',
  })
    .then(() => request(app).post(signinRoute)
      .send({
        Email: userEmail,
        Password: 'Rui@Barreto-12',
      }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid Authentication!');
    });
});

test('Test #12 - Access protected user routes', () => request(app).post(byIdRoute)
  .then((res) => {
    expect(res.status).toBe(401);
  }));

test('Test #13 - Creating a user', () => {
  const userEmail = generateUniqueEmail();

  return request(app).post(signupRoute)
    .send({
      Name: 'Rui Auth',
      Email: userEmail,
      Password: 'Rui@Barreto-123',
    })
    .then((res) => {
      expect(res.status).toBe(201);
    });
});
