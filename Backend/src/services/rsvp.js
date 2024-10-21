const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const save = async (registerRSVP) => {
    if (!registerRSVP.Status) throw new ValidationError('Status is required!');
    if (!registerRSVP.EventId) throw new ValidationError('Event ID is required!');
    if (!registerRSVP.UserId) throw new ValidationError('User ID is required!');

    const existingRSVP = await app.db('RSVP')
      .where({ EventId: registerRSVP.EventId, UserId: registerRSVP.UserId })
      .first();

    if (existingRSVP) {
      throw new ValidationError('RSVP already exists for this user in this event!');
    }

    return app.db('RSVP').insert(registerRSVP, '*');
  };

  return {
    save,
  };
};
