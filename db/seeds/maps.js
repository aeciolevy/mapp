exports.seed = function(knex, Promise) {
  return knex('maps').del()
    .then(function () {
      return Promise.all([
        knex('maps').insert({id: 1, title: 'Vancouver Coffee', user_id: 1}),
        knex('maps').insert({id: 2, title: 'Vancouver Pubs', user_id: 2}),
        knex('maps').insert({id: 3, title: 'Vancouver Best Brunchs', user_id: 1}),
        knex('maps').insert({id: 4, title: 'Vancouver Schools', user_id: 2}),
        knex('maps').insert({id: 5, title: 'Vancouver Gym', user_id: 1}),
        knex('maps').insert({id: 6, title: 'Vancouver Restaurants', user_id: 1}),
        knex('maps').insert({id: 7, title: 'Vancouver Bars', user_id: 2}),
        knex('maps').insert({id: 8, title: 'Parks in Vancouver', user_id: 3})
      ]);
    });
};
