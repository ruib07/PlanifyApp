const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    app.services.event.findAll()
      .then((result) => res.status(200).json(result))
      .catch((error) => next(error));
  });

  router.get('/:Title', (req, res, next) => {
    app.services.event.find({ Title: req.params.Title })
      .then((result) => res.status(200).json(result))
      .catch((error) => next(error));
  });

  router.post('/', (req, res, next) => {
    app.services.event.save(req.body)
      .then((result) => res.status(201).json(result))
      .catch((error) => next(error));
  });

  router.put('/:Title', (req, res, next) => {
    app.services.event.update(req.params.Title, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((error) => next(error));
  });

  router.delete('/:Title', (req, res, next) => {
    app.services.event.remove(req.params.Title)
      .then(() => res.status(204).send())
      .catch((error) => next(error));
  });

  return router;
};
