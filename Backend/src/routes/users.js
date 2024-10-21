/* eslint-disable consistent-return */
const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/:Id', (req, res, next) => {
    app.services.user.find({ Id: req.params.Id })
      .then((result) => res.status(200).json(result))
      .catch((error) => next(error));
  });

  router.get('/confirm-email/:Email', async (req, res, next) => {
    const { Email } = req.params;

    try {
      const result = await app.services.user.confirmEmail(Email);

      if (result.error) return res.status(404).json({ error: result.error });

      return res.status(200).json({ message: 'Email successfully confirmed!' });
    } catch (error) {
      next(error);
    }
  });

  router.post('/', (req, res, next) => {
    app.services.user.save(req.body)
      .then((result) => res.status(201).json(result[0]))
      .catch((error) => next(error));
  });

  router.put('/:Email/updatepassword', async (req, res) => {
    const { newPassword, confirmNewPassword } = req.body;

    const result = await app.services.user.updatePassword(
      req.params.Email,
      newPassword,
      confirmNewPassword,
    );

    if (result.error) return res.status(400).json(result);
    return res.status(200).json({ message: 'Password updated successfully!' });
  });

  router.put('/update/:Id', async (req, res, next) => {
    app.services.user.update(req.params.Id, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((error) => next(error));
  });

  return router;
};
