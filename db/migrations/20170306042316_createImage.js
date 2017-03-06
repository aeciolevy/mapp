
exports.up = function(knex, Promise) {
  return knex.schema.table("locations", (table) => {
    table.string('image', 400);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("locations", (table) => {
    table.dropColumn('image');
  });
};
