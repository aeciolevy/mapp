exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({name: 'Alice', email: 'alice@gmail.com'}),
        knex('users').insert({name: 'Bob', email: 'bob@hotmail.com'}),
        knex('users').insert({name: 'Charlie', email: 'chaz@outerspace.net'})
      ]);
    });
};
