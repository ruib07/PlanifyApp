exports.up = async (knex) => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  return knex.schema.createTable('Users', (t) => {
    t.uuid('Id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('Name', 60).notNull();
    t.string('Email', 60).notNull().unique();
    t.string('Password', 100).notNull();
    t.string('ProfilePicture', 100);
    t.timestamps(true, true);
  });
};

exports.down = (knex) => knex.schema.dropTable('Users');
