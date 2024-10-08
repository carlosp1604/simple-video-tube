import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('post_categories', (table) => {
      table.string('post_id', 36)
        .references('id')
        .inTable('posts')
        .notNullable()
        .onDelete('CASCADE')
      table.string('category_id', 36)
        .references('id')
        .inTable('categories')
        .notNullable()
        .onDelete('CASCADE')
      table.primary(['post_id', 'category_id'])
      table.timestamps(true, true)
      table.timestamp('deleted_at').defaultTo(null)
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('post_categories')
}
