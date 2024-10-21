/* eslint-disable consistent-return */
const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/attendees', async (req, res, next) => {
    try {
      const { eventId } = req.query;
      if (!eventId) return res.status(400).json({ message: 'Event ID is required!' });

      const attendees = await app.db('RSVP')
        .join('Users', 'RSVP.UserId', 'Users.Id')
        .select('Users.Id', 'Users.Name', 'Users.ProfilePicture')
        .where({ 'RSVP.EventId': eventId, 'RSVP.Status': 'confirmed' });

      return res.json(attendees);
    } catch (error) {
      next(error);
    }
  });

  router.post('/rsvp', (req, res, next) => {
    app.services.rsvp.save(req.body)
      .then((result) => res.status(201).json(result))
      .catch((error) => next(error));
  });

  return router;
};
