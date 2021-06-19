const knex = require("../db/connection");
const tableName = "subscribe";

function create(newEmail) {
   return knex(tableName).insert(newEmail).returning("*");
}

module.exports = {
   create,
};
