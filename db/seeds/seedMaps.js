exports.seed = function(knex, Promise) {
  return knex('maps').del()
    .then(function () {
      return Promise.all([
        knex('maps').insert({title: 'Vancouver Coffee', user_id: 1}),
        knex('maps').insert({title: 'Vancouver Pubs', user_id: 2}),
        knex('maps').insert({title: 'Vancouver Best Brunchs', user_id: 1}),
        knex('maps').insert({title: 'Vancouver Schools', user_id: 2}),
        knex('maps').insert({title: 'Vancouver Gym', user_id: 1}),
        knex('maps').insert({title: 'Vancouver Restaurants', user_id: 1}),
        knex('maps').insert({title: 'Vancouver Bars', user_id: 2}),
        knex('maps').insert({title: 'Parks in Vancouver', user_id: 3})
      ]);
    });
};
