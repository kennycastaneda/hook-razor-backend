exports.up = function (knex) {
   return knex.schema.table("subscribe", (table) => {
      table.string("from_page", 128).notNull().default("unknown");
   });
};

exports.down = function (knex) {
   return knex.schema.table("subscribe", (table) => {
      table.dropColumn("from_page");
   });
};
