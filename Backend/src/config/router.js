const express = require('express');

module.exports = (app) => {
  const publicRouter = express.Router();
  const secureRouter = express.Router();

  publicRouter.use('/users', app.routes.users);
  publicRouter.use('/events', app.routes.events);
  publicRouter.use('/rsvps', app.routes.rsvps);

  app.use('/auth', app.routes.auths);

  app.use('/v1', publicRouter);
  app.use('/v1', app.config.passport.userauthenticate(), secureRouter);
};
