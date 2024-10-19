const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const find = (filter = {}) => app.db('RSVP').where(filter);

  const save = (registerRSVP) => {
    if (!registerRSVP.Status) throw new ValidationError('Status is required!');

    return app.db('RSVP').insert(registerRSVP, '*');
  };

  return {
    find,
    save,
  };
};
