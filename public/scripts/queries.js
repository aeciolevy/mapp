const ENV         = process.env.ENV || "development";
const knexConfig  = require("./../../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

module.exports = {
  getMaps: (done) => {
    knex
    .select('*')
    .from('maps')
    .then(done);
  }
};
