exports.up = function (knex) {
   return knex.schema.createTable("subscribe", (table) => {
      table.increments("subscribe_id").primary();
      table.string("email");
      table.timestamps(true, true);
   });
};

exports.down = function (knex) {
   return knex.schema.dropTable("subscribe");
};
