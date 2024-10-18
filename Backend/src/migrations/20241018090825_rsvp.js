exports.up = async (knex) => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  return knex.schema.createTable('RSVP', (t) => {
    t.uuid('Id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('UserId').notNull()
      .references('Id')
      .inTable('Users')
      .onDelete('CASCADE');

    t.uuid('EventId').notNull()
      .references('Id')
      .inTable('Events')
      .onDelete('CASCADE');

    t.enu('Status', ['confirmed', 'not going']).notNull();
    t.timestamp('created_at').defaultTo(knex.fn.now()).notNull();
  });
};

exports.down = (knex) => knex.schema.dropTable('RSVP');
