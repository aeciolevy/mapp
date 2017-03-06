exports.seed = function(knex, Promise) {
  return knex('maps').del()
    .then(function () {
      return Promise.all([
        knex('maps').insert({title: 'Vancouver Coffee', user_id: 1}),
        knex('maps').insert({title: 'Vancouver Pubs', user_id: 2})
      ]);
    });
};
