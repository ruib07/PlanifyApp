/* eslint-disable consistent-return */
const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/attendess', async (req, res, next) => {
    try {
      const { eventId } = req.query;
      if (!eventId) return res.status(400).json({ message: 'Event ID is required!' });

      const attendees = await app.db('RSVP')
        .join('Users', 'RSVP.UserId', 'Users.id')
        .select('Users.id', 'Users.Name', 'Users.profile_picture')
        .where({ 'RSVP.EventId': eventId, 'RSVP.Status': 'confirmed' });

      return res.json(attendees);
    } catch (error) {
      next(error);
    }
  });

  router.post('/rsvp', async (req, res, next) => {
    try {
      const rsvp = {
        Status: res.body.status || 'confirmed',
        EventId: res.body.eventId,
        UserId: req.body.userId,
      };

      const savedRsvp = await app.services.rsvp.save(rsvp);
      return res.status(201).json({ success: true, rsvp: savedRsvp[0] });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
