exports.up = function(knex, Promise) {

  return Promise.all([
    knex.schema.createTable("locations", (table) => {
      table.increments();
      table.string('title', 60).notNullable();
      table.string('description', 100).notNullable();
      table.decimal('latitude', 10, 6).notNullable();
      table.decimal('longitude', 10, 6).notNullable();
      table.integer('map_id').unsigned().notNullable();
      table.integer('user_id').unsigned().notNullable();
    }),

    knex.schema.createTable("maps", (table) => {
      table.increments();
      table.string('title', 60).notNullable();
      table.integer('user_id').unsigned().notNullable();
    }),

    knex.schema.createTable("favorites", (table) => {
      table.increments();
      table.integer('map_id').unsigned().notNullable();
      table.integer('user_id').unsigned().notNullable();
    }),

    knex.schema.table("users", (table) => {
      table.string('email', 100).notNullable();
    })
  ]);
};

exports.down = function(knex, Promise) {

  return Promise.all([
    knex.schema.dropTable("locations"),
    knex.schema.dropTable("maps"),
    knex.schema.dropTable("favorites"),

    knex.schema.table("users", (table) => {
      table.dropColumn('email');
    })
  ]);
};
