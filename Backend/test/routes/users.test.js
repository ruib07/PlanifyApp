const request = require('supertest');
const jwt = require('jwt-simple');
const uuid = require('uuid');
const app = require('../../src/app');

const route = '/v1/users';
const secret = 'userPlanify@202425';

const generateUniqueEmail = () => `${uuid.v4()}@gmail.com`;

let userToken;

beforeAll(async () => {
  const userEmail = generateUniqueEmail();

  const userRegistration = await app.services.user.save({
    Name: 'Rui Barreto',
    Email: userEmail,
    Password: 'Rui@Barreto-123',
  });

  userToken = { ...userRegistration[0] };
  userToken.userToken = jwt.encode(userToken, secret);
});

test('Test #1 - Get User by ID', () => {
  const userEmail = generateUniqueEmail();

  return app.db('Users')
    .insert({
      Name: 'Rui Barreto',
      Email: userEmail,
      Password: 'Rui@Barreto-123',
    }, ['Id'])
    .then((userRes) => request(app).get(`${route}/${userRes[0].Id}`)
      .set('Authorization', `bearer ${userToken.userToken}`))
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

test('Test #2 - Insert a user', async () => {
  const userEmail = generateUniqueEmail();

  const res = await request(app).post(route)
    .send({
      Name: 'Rui Barreto',
      Email: userEmail,
      Password: 'Rui@Barreto-123',
    });
  expect(res.status).toBe(201);
});

test('Test #2.1 - Save encripted password', async () => {
  const userEmail = generateUniqueEmail();

  const res = await request(app).post(route)
    .send({
      Name: 'Rui Barreto',
      Email: userEmail,
      Password: 'Rui@Barreto-123',
    });

  expect(res.status).toBe(201);

  const { Id } = res.body;
  const userRegistrationDB = await app.services.user.find({ Id });
  expect(userRegistrationDB.Password).not.toBeUndefined();
  expect(userRegistrationDB.Password).not.toBe('Rui@Barreto-123');
});

describe('User creation validation', () => {
  const userEmail = generateUniqueEmail();

  const testTemplate = (newData, errorMessage) => request(app).post(route)
    .send({
      Name: 'Rui Barreto',
      Email: userEmail,
      Password: 'Rui@Barreto-123',
      ...newData,
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(errorMessage);
    });

  test('Test #3 - Insert a user without name', () => testTemplate({ Name: null }, 'Name is required!'));
  test('Test #4 - Insert a user without email', () => testTemplate({ Email: null }, 'Email is required!'));
  test('Test #5 - Insert a user without password', () => testTemplate({ Password: null }, 'Password is required!'));
});

test('Test #6 - Checking email that exists', async () => {
  const existingEmail = 'b5ded14f-af5e-4307-965b-4a15a7b8c248@gmail.com';

  const confirmationEmailResponse = await request(app).get(`${route}/confirm-email/${existingEmail}`);

  expect(confirmationEmailResponse.status).toBe(200);
  expect(confirmationEmailResponse.body.message).toBe('Email successfully confirmed!');
});

test('Test #7 - Checking email that does not exist', async () => {
  const nonExistingEmail = 'nonexistentemail@gmail.com';

  const confirmationEmailResponse = await request(app).get(`${route}/confirm-email/${nonExistingEmail}`);

  expect(confirmationEmailResponse.status).toBe(404);
  expect(confirmationEmailResponse.body.error).toBe('Email not found!');
});

test('Test #8 - Insert and confirm password', async () => {
  const userEmail = generateUniqueEmail();

  const userRegistrationRes = await request(app).post(route)
    .send({
      Name: 'Rui Barreto',
      Email: userEmail,
      Password: 'Rui@Barreto-123',
    });

  expect(userRegistrationRes.status).toBe(201);

  const updatePasswordResponse = await request(app).put(`${route}/${userRegistrationRes.body.Email}/updatepassword`)
    .send({
      newPassword: 'Rui@Barreto-12',
      confirmNewPassword: 'Rui@Barreto-12',
    });

  expect(updatePasswordResponse.status).toBe(200);
  expect(updatePasswordResponse.body.message).toBe('Password updated successfully!');
});

test('Test #9 - Insert different passwords', async () => {
  const userEmail = generateUniqueEmail();

  const userRegistrationRes = await request(app).post(route)
    .send({
      Name: 'Rui Barreto',
      Email: userEmail,
      Password: 'Rui@Barreto-123',
    });

  expect(userRegistrationRes.status).toBe(201);

  const updatePasswordResponse = await request(app).put(`${route}/${userRegistrationRes.body.Email}/updatepassword`)
    .send({
      newPassword: 'Rui@Barreto-12',
      confirmNewPassword: 'Rui@Barreto-121',
    });

  expect(updatePasswordResponse.status).toBe(400);
});
