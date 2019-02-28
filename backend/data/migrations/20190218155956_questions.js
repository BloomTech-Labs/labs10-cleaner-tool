exports.up = function (knex, Promise) {
    return knex.schema.createTable('questions', (table) => {
        table
            .increments()
            .unique()
            .primary()
        table.string('question')
        table.integer('type')
        table.integer('survey_id')
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('questions');
};
