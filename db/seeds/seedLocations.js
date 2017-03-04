exports.seed = function(knex, Promise) {
  return knex('locations').del()
    .then(function () {
      return Promise.all([
        knex('locations').insert({title: 'Medina', description: 'something', latitude: 49.28667, longitude: -123.13253, map_id: 1, user_id: 2 }),
        knex('locations').insert({title: 'The Templon', description: 'something', latitude: 49.28667, longitude: -125.13253, map_id: 1, user_id: 3 }),
        knex('locations').insert({title: 'Blenz', description: 'something', latitude: 49.0, longitude: -124.13253, map_id: 1, user_id: 1 }),
        knex('locations').insert({title: 'Starbucks', description: 'something', latitude: 40.0, longitude: -123.98721, map_id: 1, user_id: 2 }),
        knex('locations').insert({title: 'Tim Hortons', description: 'something', latitude: 46.0, longitude: -123.14453, map_id: 1, user_id: 1 }),
        knex('locations').insert({title: '7 Eleven', description: 'something', latitude: 49.28667, longitude: -123.23253, map_id: 1, user_id: 2 }),
        knex('locations').insert({title: 'The pig flag', description: 'something', latitude: 49.28667, longitude: -121.13253, map_id: 1, user_id: 1 }),
        knex('locations').insert({title: 'What else', description: 'something', latitude: 49.28667, longitude: -122.13253, map_id: 1, user_id: 2 })
      ]);
    });
};
