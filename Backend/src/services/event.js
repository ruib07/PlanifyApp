const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = () => app.db('Events');

  const find = (filter = {}) => app.db('Events').where(filter).first();

  const save = (registerEvent) => {
    if (!registerEvent.Title) throw new ValidationError('Title of the event is required!');
    if (!registerEvent.Description) throw new ValidationError('Description of the event is required!');
    if (!registerEvent.Location) throw new ValidationError('Location of the event is required!');
    if (!registerEvent.Date) throw new ValidationError('Date of the event is required!');
    if (!registerEvent.Time) throw new ValidationError('Time of the event is required!');
    if (!registerEvent.IsPublic) throw new ValidationError('Public status of the event is required!');

    return app.db('Events').insert(registerEvent, '*');
  };

  const update = (Title, eventRes) => app.db('Events')
    .where({ Title })
    .update(eventRes, '*');

  const remove = (Title) => app.db('Events')
    .where({ Title })
    .del();

  return {
    findAll,
    find,
    save,
    update,
    remove,
  };
};
