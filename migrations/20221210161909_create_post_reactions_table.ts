import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('post_reactions', function (table) {
      table.string('post_id', 36)
        .references('id')
        .inTable('posts')
        .notNullable()
      table.string('user_id', 36)
        .references('id')
        .inTable('users')
        .notNullable()
      table.string('reaction_type', 16).index()
      table.primary(['post_id', 'user_id'])
      table.timestamp('created_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        .notNullable()
      table.timestamp('updated_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        .notNullable()
      table.timestamp('deleted_at')
        .defaultTo(null)
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('post_reactions')
}
