exports.up = async (knex) => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  return knex.schema.createTable('Events', (t) => {
    t.uuid('Id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('Title', 60).notNull();
    t.string('Description', 255).notNull();
    t.string('Location', 100).notNull();
    t.date('Date').notNull();
    t.time('Time').notNull();
    t.boolean('IsPublic').notNull();
    t.timestamps(true, true);

    t.uuid('CreatorId')
      .references('Id')
      .inTable('Users')
      .onDelete('CASCADE')
      .notNull();
  });
};

exports.down = (knex) => knex.schema.dropTable('Events');
