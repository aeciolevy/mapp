const ENV         = process.env.ENV || "development";
const knexConfig  = require("./../../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

module.exports = {
  // getMaps: (done) => {
  //   knex
  //   .select('*')
  //   .from('maps');
  // },
  // getOneMap: (id, done) =>{
  //   knex
  //   .select('*')
  //   .from('maps')
  //   .where({
  //     id: id
  //   }).then(done);
  // },
  // getContributed: (id, done) => {
  //   knex
  //   .select('maps.title')
  //   .from('maps')
  //   .join('locations', {'locations.map_id': 'maps.id'})
  //   .where({
  //     'locations.user_id': 2
  //   }).then(done)
  //    .catch(function(error) {
  //      console.error(error);
  //    });
  // }
};

