const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

const secret = 'userPlanify@202425';

module.exports = (app) => {
  const router = express.Router();

  router.post('/usersignin', (req, res, next) => {
    app.services.user.find({
      Email: req.body.Email,
    })
      .then((user) => {
        if (bcrypt.compareSync(req.body.Password, user.Password)) {
          const payload = {
            Id: user.Id,
            Name: user.Name,
            Email: user.Email,
          };

          const userToken = jwt.encode(payload, secret);
          res.status(200).json({ userToken, user: payload });
        } else {
          res.status(400).json({ error: 'Invalid Authentication!' });
        }
      })
      .catch((error) => next(error));
  });

  router.post('/usersignup', async (req, res, next) => {
    try {
      const result = await app.services.user.save(req.body);
      return res.status(201).json(result[0]);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
