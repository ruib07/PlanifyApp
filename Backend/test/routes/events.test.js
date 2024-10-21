const request = require('supertest');
const uuid = require('uuid');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const route = '/v1/events';
const userSecret = 'userPlanify@202425';

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
  userToken.userToken = jwt.encode(userToken, userSecret);
});

test('Test #15 - Get all events', () => request(app).get(route)
  .then((res) => {
    expect(res.status).toBe(200);
  }));

test('Test #16 - Get a event by his title', () => app.db('Events')
  .insert({
    Title: 'Tech Conference 2024',
    Description: 'An annual conference focused on technological innovation, bringing together technology experts and enthusiasts for lectures, workshops and networking.',
    Location: 'Centro de Convenções de Lisboa, Lisboa, Portugal',
    Date: '2024-05-12',
    Time: '10:00:00',
    IsPublic: true,
    CreatorId: userToken.Id,
  }, ['Title'])
  .then((eventRes) => request(app).get(`${route}/${eventRes[0].Title}`))
  .then((res) => {
    expect(res.status).toBe(200);
  }));

test('Test #17 - Inserting a new event', async () => {
  await request(app).post(route)
    .set('Authorization', `bearer ${userToken.userToken}`)
    .send({
      Title: 'Tech Conference 2024',
      Description: 'An annual conference focused on technological innovation, bringing together technology experts and enthusiasts for lectures, workshops and networking.',
      Location: 'Centro de Convenções de Lisboa, Lisboa, Portugal',
      Date: '2024-05-12',
      Time: '10:00:00',
      IsPublic: true,
      CreatorId: userToken.Id,
    })
    .then((res) => {
      expect(res.status).toBe(201);
    });
});

describe('Event creation validation', () => {
  const testTemplate = (newData, errorMessage) => request(app).post(route)
    .set('Authorization', `bearer ${userToken.userToken}`)
    .send({
      Title: 'Tech Conference 2024',
      Description: 'An annual conference focused on technological innovation, bringing together technology experts and enthusiasts for lectures, workshops and networking.',
      Location: 'Centro de Convenções de Lisboa, Lisboa, Portugal',
      Date: '2024-05-12',
      Time: '10:00:00',
      IsPublic: true,
      CreatorId: userToken.Id,
      ...newData,
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(errorMessage);
    });

  test('Test #18 - Insert a event without a title', () => testTemplate({ Title: null }, 'Title of the event is required!'));
  test('Test #19 - Insert a event without a description', () => testTemplate({ Description: null }, 'Description of the event is required!'));
  test('Test #20 - Insert a event without a location', () => testTemplate({ Location: null }, 'Location of the event is required!'));
  test('Test #21 - Insert a event without a date', () => testTemplate({ Date: null }, 'Date of the event is required!'));
  test('Test #22 - Insert a event without a time', () => testTemplate({ Time: null }, 'Time of the event is required!'));
  test('Test #23 - Insert a event without IsPublic status', () => testTemplate({ IsPublic: null }, 'Public status of the event is required!'));
});

test('Test #24 - Updating event data', () => app.db('Events')
  .insert({
    Title: 'Tech Conference 2024',
    Description: 'An annual conference focused on technological innovation, bringing together technology experts and enthusiasts for lectures, workshops and networking.',
    Location: 'Centro de Convenções de Lisboa, Lisboa, Portugal',
    Date: '2024-05-12',
    Time: '10:00:00',
    IsPublic: true,
    CreatorId: userToken.Id,
  }, ['Title'])
  .then((eventRes) => request(app).put(`${route}/${eventRes[0].Title}`)
    .set('Authorization', `bearer ${userToken.userToken}`)
    .send({
      Title: 'Creative Photography Workshop',
      Description: 'A hands-on workshop for beginner and intermediate photographers, focusing on creative composition techniques and image editing.',
      Location: 'Creative Studio, Arts Street, Porto, Portugal',
      Date: '2024-07-22',
      Time: '14:30:00',
      IsPublic: false,
      CreatorId: userToken.Id,
    }))
  .then((res) => {
    expect(res.status).toBe(200);
  }));

test('Test #25 - Deleting an event', () => app.db('Events')
  .insert({
    Title: 'Tech Conference 2024',
    Description: 'An annual conference focused on technological innovation, bringing together technology experts and enthusiasts for lectures, workshops and networking.',
    Location: 'Centro de Convenções de Lisboa, Lisboa, Portugal',
    Date: '2024-05-12',
    Time: '10:00:00',
    IsPublic: true,
    CreatorId: userToken.Id,
  }, ['Title'])
  .then((eventRes) => request(app).delete(`${route}/${eventRes[0].Title}`)
    .set('Authorization', `bearer ${userToken.userToken}`)
    .send({
      Title: 'Deleted Event',
    }))
  .then((res) => {
    expect(res.status).toBe(204);
  }));
