const request = require('supertest');
const uuid = require('uuid');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const route = '/v1/rsvps';
const userSecret = 'userPlanify@202425';

const generateUniqueEmail = () => `${uuid.v4()}@gmail.com`;

let userToken;
let event;

beforeAll(async () => {
  const userEmail = generateUniqueEmail();

  const userRegistration = await app.services.user.save({
    Name: 'Rui Barreto',
    Email: userEmail,
    Password: 'Rui@Barreto-123',
  });

  userToken = { ...userRegistration[0] };
  userToken.userToken = jwt.encode(userToken, userSecret);

  const eventRegistration = await app.services.event.save({
    Title: 'Tech Conference 2024',
    Description: 'An annual conference focused on technological innovation, bringing together technology experts and enthusiasts for lectures, workshops and networking.',
    Location: 'Centro de Convenções de Lisboa, Lisboa, Portugal',
    Date: '2024-05-12',
    Time: '10:00:00',
    IsPublic: true,
    CreatorId: userToken.Id,
  });

  event = { ...eventRegistration[0] };
});

test('Test #26 - Get all the event attendees', async () => {
  const attendeeEmail = generateUniqueEmail();

  const attendeeRegistration = await app.services.user.save({
    Name: 'Ana Silva',
    Email: attendeeEmail,
    Password: 'Ana@Silva-123',
  });

  const attendee = { ...attendeeRegistration[0] };
  attendee.token = jwt.encode(attendee, userSecret);

  await app.services.rsvp.save({
    EventId: event.Id,
    UserId: attendee.Id,
    Status: 'confirmed',
  });

  const response = await request(app).get(`${route}/attendees`)
    .query({ eventId: event.Id })
    .set('Authorization', `Bearer ${userToken.userToken}`);

  expect(response.status).toBe(200);
});

test('Test #27 - Creating a new RSVP', async () => {
  const attendeeEmail = generateUniqueEmail();

  const attendeeRegistration = await app.services.user.save({
    Name: 'Ana Silva',
    Email: attendeeEmail,
    Password: 'Ana@Silva-123',
  });

  const attendee = { ...attendeeRegistration[0] };
  attendee.token = jwt.encode(attendee, userSecret);

  await request(app).post(`${route}/rsvp`)
    .set('Authorization', `bearer ${userToken.userToken}`)
    .send({
      EventId: event.Id,
      UserId: attendee.Id,
      Status: 'confirmed',
    })
    .then((res) => {
      expect(res.status).toBe(201);
    });
});

describe('RSVP creation validation', () => {
  const attendeeEmail = generateUniqueEmail();

  const attendeeRegistration = app.services.user.save({
    Name: 'Ana Silva',
    Email: attendeeEmail,
    Password: 'Ana@Silva-123',
  });

  const attendee = { ...attendeeRegistration[0] };
  attendee.token = jwt.encode(attendee, userSecret);

  const testTemplate = (newData, errorMessage) => request(app).post(`${route}/rsvp`)
    .set('Authorization', `bearer ${userToken.userToken}`)
    .send({
      EventId: event.Id,
      UserId: attendee.Id,
      Status: 'confirmed',
      ...newData,
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(errorMessage);
    });

  test('Test #28 - Insert a rsvp without status', () => testTemplate({ Status: null }, 'Status is required!'));
  test('Test #29 - Insert a rsvp without user id', () => testTemplate({ UserId: null }, 'User ID is required!'));
  test('Test #30 - Insert a rsvp without event id', () => testTemplate({ EventId: null }, 'Event ID is required!'));
});
